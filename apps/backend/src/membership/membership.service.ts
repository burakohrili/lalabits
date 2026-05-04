import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  MembershipSubscription,
  MembershipSubscriptionStatus,
  BillingInterval,
} from '../billing/entities/membership-subscription.entity';
import {
  MembershipPlan,
  MembershipPlanStatus,
} from '../creator/entities/membership-plan.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { Invoice, InvoiceStatus, InvoiceType } from '../billing/entities/invoice.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { IyzicoService } from '../iyzico/iyzico.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../moderation/entities/notification.entity';
import { MilestoneService } from '../milestone/milestone.service';

// LD-1: Entitlement rule — active access = status IN (active, cancelled, grace_period) AND current_period_end > NOW()
// grace_period = renewal failed, still within grace window
export function isAccessActive(sub: MembershipSubscription): boolean {
  const now = new Date();
  if (sub.status === MembershipSubscriptionStatus.GracePeriod) {
    // Grace period: access continues if grace has not expired
    return sub.grace_period_ends_at != null && sub.grace_period_ends_at > now;
  }
  return (
    (sub.status === MembershipSubscriptionStatus.Active ||
      sub.status === MembershipSubscriptionStatus.Cancelled) &&
    sub.current_period_end > now
  );
}

const ACTIVE_STATUSES = [
  MembershipSubscriptionStatus.Active,
  MembershipSubscriptionStatus.Cancelled,
  MembershipSubscriptionStatus.GracePeriod,
];

@Injectable()
export class MembershipService {
  private readonly logger = new Logger(MembershipService.name);

  constructor(
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(MembershipPlan)
    private readonly planRepository: Repository<MembershipPlan>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    private readonly iyzicoService: IyzicoService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
    private readonly milestoneService: MilestoneService,
  ) {}

  // ── SUBSCRIBE ────────────────────────────────────────────────────────────

  async subscribe(userId: string, dto: SubscribeDto) {
    const plan = await this.planRepository.findOne({
      where: { id: dto.plan_id },
    });

    if (!plan || plan.status !== MembershipPlanStatus.Published) {
      throw new UnprocessableEntityException('PLAN_NOT_AVAILABLE');
    }

    const creatorProfile = await this.creatorProfileRepository.findOne({
      where: { id: plan.creator_profile_id },
    });
    if (!creatorProfile || creatorProfile.status === CreatorProfileStatus.Suspended) {
      throw new UnprocessableEntityException('PLAN_NOT_AVAILABLE');
    }
    if (creatorProfile.user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_SUBSCRIBE_OWN');
    }

    // Duplicate check — includes grace_period (still paying)
    const existing = await this.subscriptionRepository.findOne({
      where: {
        fan_user_id: userId,
        creator_profile_id: plan.creator_profile_id,
        status: In(ACTIVE_STATUSES),
      },
      order: { created_at: 'DESC' },
    });

    if (existing && isAccessActive(existing)) {
      throw new ConflictException('ALREADY_SUBSCRIBED');
    }

    if (!this.iyzicoService.isEnabled) {
      return this.mockSubscribe(userId, plan, dto.billing_interval);
    }

    return this.realSubscribe(userId, plan, dto.billing_interval);
  }

  private async mockSubscribe(
    userId: string,
    plan: MembershipPlan,
    billingInterval: BillingInterval,
  ) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const sub = await this.subscriptionRepository.save(
      this.subscriptionRepository.create({
        fan_user_id: userId,
        membership_plan_id: plan.id,
        creator_profile_id: plan.creator_profile_id,
        billing_interval: billingInterval,
        status: MembershipSubscriptionStatus.Active,
        current_period_start: now,
        current_period_end: periodEnd,
        cancelled_at: null,
        cancellation_reason: null,
        grace_period_ends_at: null,
        gateway_subscription_id: null,
      }),
    );

    await this.notificationService.createNotification({
      recipientUserId: userId,
      type: NotificationType.MembershipRenewalSuccess,
      title: 'Üyeliğiniz başladı',
      body: `${plan.name} üyeliğiniz aktif. Erişim: ${sub.current_period_end.toLocaleDateString('tr-TR')}.`,
      actionUrl: '/uyeliklerim',
    });

    this.milestoneService.checkAndTriggerForFan(userId).catch((err) =>
      this.logger.error(`Milestone check failed for fan ${userId}: ${(err as Error).message}`),
    );
    this.milestoneService.checkAndTriggerForCreator(plan.creator_profile_id).catch((err) =>
      this.logger.error(`Milestone check failed for creator ${plan.creator_profile_id}: ${(err as Error).message}`),
    );

    return {
      subscription_id: sub.id,
      plan_id: plan.id,
      plan_name: plan.name,
      status: sub.status,
      current_period_end: sub.current_period_end,
      mock: true,
    };
  }

  private async realSubscribe(
    userId: string,
    plan: MembershipPlan,
    billingInterval: BillingInterval,
  ) {
    if (!plan.gateway_plan_reference) {
      throw new UnprocessableEntityException('PLAN_NOT_CONFIGURED_AT_GATEWAY');
    }

    const conversationId = randomUUID();
    const callbackUrl = this.configService.get<string>(
      'MEMBERSHIP_CALLBACK_URL',
      'http://localhost:3001/membership/callback',
    );

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    // Create pending subscription — gateway_subscription_id populated after callback
    const sub = await this.subscriptionRepository.save(
      this.subscriptionRepository.create({
        fan_user_id: userId,
        membership_plan_id: plan.id,
        creator_profile_id: plan.creator_profile_id,
        billing_interval: billingInterval,
        status: MembershipSubscriptionStatus.Pending,
        current_period_start: now,
        current_period_end: periodEnd,
        cancelled_at: null,
        cancellation_reason: null,
        grace_period_ends_at: null,
        gateway_subscription_id: conversationId, // temp placeholder; overwritten after callback
      }),
    );

    // LD-2: Use hosted subscription checkout form
    const iyzicoRequest = {
      locale: 'tr',
      conversationId,
      pricingPlanReferenceCode: plan.gateway_plan_reference,
      subscriptionInitialStatus: 'ACTIVE',
      customer: {
        name: 'Fan',
        surname: 'User',
        email: `${userId}@lalabits.art`,
        gsmNumber: '+905000000000',
        identityNumber: '11111111111',
        billingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
        shippingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
      },
      callbackUrl,
    };

    const iyzicoResult = await this.iyzicoService.initializeSubscriptionCheckoutForm(iyzicoRequest);

    if (iyzicoResult.status !== 'success' || !iyzicoResult.checkoutFormContent) {
      await this.subscriptionRepository.update(
        { id: sub.id },
        { status: MembershipSubscriptionStatus.Expired },
      );
      this.logger.error(`İyzico subscription init failed: ${iyzicoResult.errorMessage}`);
      throw new InternalServerErrorException('SUBSCRIPTION_INIT_FAILED');
    }

    return {
      subscription_id: sub.id,
      conversation_id: conversationId,
      plan_id: plan.id,
      plan_name: plan.name,
      checkout_form_content: iyzicoResult.checkoutFormContent,
    };
  }

  // ── SUBSCRIPTION CALLBACK (İyzico → backend) ─────────────────────────────
  // LD-3: Retrieve gateway state via token, confirm, then update local record.

  async finalizeSubscriptionByToken(
    token: string,
  ): Promise<{ conversationId: string; status: string }> {
    const iyzicoResult = await this.iyzicoService.retrieveSubscriptionCheckoutFormResult({ token });

    // Map conversationId from gateway response or use referenceCode to locate sub
    const sub = iyzicoResult.referenceCode
      ? await this.subscriptionRepository.findOne({
          where: { gateway_subscription_id: iyzicoResult.referenceCode },
        })
      : null;

    // Fallback: find by pending status if referenceCode lookup fails
    const pendingSub = sub ?? await this.findPendingSubByToken(token);

    if (!pendingSub) {
      this.logger.error(`Subscription callback: no subscription found for token`);
      return { conversationId: '', status: MembershipSubscriptionStatus.Expired };
    }

    if (pendingSub.status !== MembershipSubscriptionStatus.Pending) {
      // Already processed (idempotency)
      return { conversationId: pendingSub.gateway_subscription_id ?? '', status: pendingSub.status };
    }

    if (iyzicoResult.status !== 'success') {
      await this.subscriptionRepository.update(
        { id: pendingSub.id },
        { status: MembershipSubscriptionStatus.Expired },
      );
      return { conversationId: pendingSub.gateway_subscription_id ?? '', status: 'failed' };
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    // Confirmed success: activate subscription with real gateway reference
    await this.subscriptionRepository.update(
      { id: pendingSub.id },
      {
        status: MembershipSubscriptionStatus.Active,
        gateway_subscription_id: iyzicoResult.referenceCode ?? pendingSub.gateway_subscription_id,
        current_period_start: now,
        current_period_end: periodEnd,
      },
    );

    // Create first-charge invoice
    const plan = await this.planRepository.findOne({ where: { id: pendingSub.membership_plan_id } });
    if (plan) {
      await this.invoiceRepository.save(
        this.invoiceRepository.create({
          fan_user_id: pendingSub.fan_user_id,
          membership_subscription_id: pendingSub.id,
          order_id: null,
          invoice_type: InvoiceType.SubscriptionCharge,
          amount_try: plan.price_monthly_try,
          currency: 'TRY',
          status: InvoiceStatus.Paid,
          gateway_invoice_id: iyzicoResult.referenceCode ?? null,
          issued_at: now,
          paid_at: now,
        }),
      );
    }

    await this.notificationService.createNotification({
      recipientUserId: pendingSub.fan_user_id,
      type: NotificationType.MembershipRenewalSuccess,
      title: 'Üyeliğiniz başladı',
      body: plan ? `${plan.name} üyeliğiniz aktif.` : 'Üyeliğiniz aktif.',
      actionUrl: '/uyeliklerim',
    });

    this.milestoneService.checkAndTriggerForFan(pendingSub.fan_user_id).catch((err) =>
      this.logger.error(`Milestone check failed for fan ${pendingSub.fan_user_id}: ${(err as Error).message}`),
    );
    this.milestoneService.checkAndTriggerForCreator(pendingSub.creator_profile_id).catch((err) =>
      this.logger.error(`Milestone check failed for creator ${pendingSub.creator_profile_id}: ${(err as Error).message}`),
    );

    return {
      conversationId: iyzicoResult.referenceCode ?? '',
      status: MembershipSubscriptionStatus.Active,
    };
  }

  // Temp lookup during pending phase — subscriptions use conversationId as placeholder gateway_subscription_id
  private async findPendingSubByToken(_token: string): Promise<MembershipSubscription | null> {
    return this.subscriptionRepository.findOne({
      where: { status: MembershipSubscriptionStatus.Pending },
      order: { created_at: 'DESC' },
    });
  }

  // ── SUBSCRIPTION RESULT POLL ─────────────────────────────────────────────

  async getSubscriptionResult(
    userId: string,
    subscriptionId: string,
  ): Promise<{ status: string }> {
    const sub = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, fan_user_id: userId },
    });

    if (!sub) {
      throw new NotFoundException('SUBSCRIPTION_NOT_FOUND');
    }

    return { status: sub.status };
  }

  // ── STATUS ───────────────────────────────────────────────────────────────

  async getStatus(userId: string, creatorUsername: string) {
    const creator = await this.creatorProfileRepository.findOne({
      where: { username: creatorUsername },
    });

    if (!creator) {
      return { subscribed: false };
    }

    const sub = await this.subscriptionRepository.findOne({
      where: {
        fan_user_id: userId,
        creator_profile_id: creator.id,
        status: In(ACTIVE_STATUSES),
      },
      order: { created_at: 'DESC' },
    });

    if (!sub || !isAccessActive(sub)) {
      return { subscribed: false };
    }

    const plan = await this.planRepository.findOne({
      where: { id: sub.membership_plan_id },
    });

    return {
      subscribed: true,
      subscription_id: sub.id,
      plan_id: sub.membership_plan_id,
      plan_name: plan?.name ?? null,
      status: sub.status,
      current_period_end: sub.current_period_end,
    };
  }

  // ── LIST ─────────────────────────────────────────────────────────────────

  async listSubscriptions(userId: string) {
    const now = new Date();
    const subs = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.membership_plan', 'plan')
      .leftJoinAndSelect('sub.creator_profile', 'creator')
      .where('sub.fan_user_id = :userId', { userId })
      .andWhere('sub.status IN (:...statuses)', { statuses: ACTIVE_STATUSES })
      .andWhere('sub.current_period_end > :now', { now })
      .orderBy('sub.created_at', 'DESC')
      .getMany();

    const items = subs.map((sub) => ({
      subscription_id: sub.id,
      plan_id: sub.membership_plan_id,
      plan_name: (sub.membership_plan as MembershipPlan)?.name ?? null,
      creator_display_name: (sub.creator_profile as CreatorProfile)?.display_name ?? null,
      creator_username: (sub.creator_profile as CreatorProfile)?.username ?? null,
      status: sub.status,
      billing_interval: sub.billing_interval,
      current_period_end: sub.current_period_end,
    }));

    return { items };
  }

  // ── LIST ALL (billing page — includes expired and pending) ──────────────────

  async listSubscriptionHistory(
    userId: string,
    statusFilter?: MembershipSubscriptionStatus,
    page = 1,
    limit = 20,
  ) {
    const qb = this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.membership_plan', 'plan')
      .leftJoinAndSelect('sub.creator_profile', 'creator')
      .where('sub.fan_user_id = :userId', { userId })
      .orderBy('sub.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (statusFilter) {
      qb.andWhere('sub.status = :status', { status: statusFilter });
    }

    const [subs, total] = await qb.getManyAndCount();

    const items = subs.map((sub) => ({
      subscription_id: sub.id,
      plan_id: sub.membership_plan_id,
      plan_name: (sub.membership_plan as MembershipPlan)?.name ?? null,
      creator_display_name: (sub.creator_profile as CreatorProfile)?.display_name ?? null,
      creator_username: (sub.creator_profile as CreatorProfile)?.username ?? null,
      status: sub.status,
      billing_interval: sub.billing_interval,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancelled_at: sub.cancelled_at,
      grace_period_ends_at: sub.grace_period_ends_at,
    }));

    return { items, total, page, limit };
  }

  // ── CANCEL (LD-1: route contract preserved as DELETE /membership/subscriptions/:id) ─

  async cancel(userId: string, subscriptionId: string) {
    const sub = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, fan_user_id: userId },
    });

    if (!sub) {
      throw new NotFoundException('SUBSCRIPTION_NOT_FOUND');
    }

    if (sub.status === MembershipSubscriptionStatus.Cancelled) {
      throw new ConflictException('ALREADY_CANCELLED');
    }

    if (!isAccessActive(sub)) {
      throw new UnprocessableEntityException('SUBSCRIPTION_NOT_ACTIVE');
    }

    // Call gateway cancel if real payment is enabled and gateway ref exists
    if (this.iyzicoService.isEnabled && sub.gateway_subscription_id) {
      try {
        const cancelResult = await this.iyzicoService.cancelSubscription(sub.gateway_subscription_id);
        if (cancelResult.status !== 'success') {
          this.logger.warn(
            `İyzico cancel warning for sub ${subscriptionId}: ${cancelResult.errorMessage}`,
          );
          // Proceed with local cancel even if gateway call returns non-success
          // Gateway may have already cancelled. Local state is the access authority.
        }
      } catch (err) {
        this.logger.error(`İyzico cancel error for sub ${subscriptionId}:`, err);
        // Proceed with local cancel — gateway call is best-effort for now
      }
    }

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.Cancelled,
        cancelled_at: new Date(),
      },
    );

    await this.notificationService.createNotification({
      recipientUserId: userId,
      type: NotificationType.MembershipCancelledConfirmed,
      title: 'Üyeliğiniz iptal edildi',
      body: `Üyeliğiniz dönem sonuna kadar aktif kalmaya devam edecek: ${sub.current_period_end.toLocaleDateString('tr-TR')}.`,
      actionUrl: '/hesabim/faturalarim',
    });

    // TODO: analytics event — subscription_cancelled
    return {
      subscription_id: sub.id,
      status: MembershipSubscriptionStatus.Cancelled,
      current_period_end: sub.current_period_end,
    };
  }

  // ── ENTITLEMENT CHECK (used by LibraryService and WebhookService) ────────

  async hasActiveTierAccess(
    userId: string,
    creatorProfileId: string,
    requiredTierRank: number,
  ): Promise<boolean> {
    const now = new Date();
    const sub = await this.subscriptionRepository
      .createQueryBuilder('sub')
      .leftJoinAndSelect('sub.membership_plan', 'plan')
      .where('sub.fan_user_id = :userId', { userId })
      .andWhere('sub.creator_profile_id = :creatorProfileId', { creatorProfileId })
      .andWhere('sub.status IN (:...statuses)', { statuses: ACTIVE_STATUSES })
      .andWhere('sub.current_period_end > :now', { now })
      .getOne();

    if (!sub || !isAccessActive(sub)) return false;
    const plan = sub.membership_plan as MembershipPlan;
    return plan?.tier_rank >= requiredTierRank;
  }

  // ── WEBHOOK HANDLERS (called by WebhookService after gateway state confirm) ─

  async handleRenewalSuccess(
    gatewaySubscriptionId: string,
    gatewayPaymentId: string,
    amountTry: number,
  ): Promise<void> {
    const sub = await this.subscriptionRepository.findOne({
      where: { gateway_subscription_id: gatewaySubscriptionId },
    });

    if (!sub) {
      this.logger.warn(`Renewal success: no sub found for gatewayId=${gatewaySubscriptionId}`);
      return;
    }

    const now = new Date();
    const newPeriodEnd = new Date(sub.current_period_end);
    newPeriodEnd.setDate(newPeriodEnd.getDate() + 30);

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.Active,
        current_period_end: newPeriodEnd,
        grace_period_ends_at: null,
      },
    );

    await this.invoiceRepository.save(
      this.invoiceRepository.create({
        fan_user_id: sub.fan_user_id,
        membership_subscription_id: sub.id,
        order_id: null,
        invoice_type: InvoiceType.SubscriptionRenewal,
        amount_try: amountTry,
        currency: 'TRY',
        status: InvoiceStatus.Paid,
        gateway_invoice_id: gatewayPaymentId,
        issued_at: now,
        paid_at: now,
      }),
    );

    this.milestoneService.checkAndTriggerForFan(sub.fan_user_id).catch((err) =>
      this.logger.error(`Milestone check failed for fan ${sub.fan_user_id}: ${(err as Error).message}`),
    );
    this.milestoneService.checkAndTriggerForCreator(sub.creator_profile_id).catch((err) =>
      this.logger.error(`Milestone check failed for creator ${sub.creator_profile_id}: ${(err as Error).message}`),
    );
  }

  async handleRenewalFailure(gatewaySubscriptionId: string): Promise<void> {
    const sub = await this.subscriptionRepository.findOne({
      where: { gateway_subscription_id: gatewaySubscriptionId },
    });

    if (!sub) {
      this.logger.warn(`Renewal failure: no sub found for gatewayId=${gatewaySubscriptionId}`);
      return;
    }

    const gracePeriodDays = this.configService.get<number>('GRACE_PERIOD_DAYS', 7);
    const graceEnd = new Date();
    graceEnd.setDate(graceEnd.getDate() + gracePeriodDays);

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.GracePeriod,
        grace_period_ends_at: graceEnd,
      },
    );

    const plan = await this.planRepository.findOne({ where: { id: sub.membership_plan_id } });

    await this.invoiceRepository.save(
      this.invoiceRepository.create({
        fan_user_id: sub.fan_user_id,
        membership_subscription_id: sub.id,
        order_id: null,
        invoice_type: InvoiceType.SubscriptionRenewal,
        amount_try: plan?.price_monthly_try ?? 0,
        currency: 'TRY',
        status: InvoiceStatus.Failed,
        gateway_invoice_id: null,
        issued_at: new Date(),
        paid_at: null,
      }),
    );

    await this.notificationService.createNotification({
      recipientUserId: sub.fan_user_id,
      type: NotificationType.MembershipRenewalFailed,
      title: 'Üyelik yenileme başarısız',
      body: plan
        ? `${plan.name} üyeliğiniz yenilenemedi. Ödeme bilgilerinizi güncelleyin.`
        : 'Üyeliğiniz yenilenemedi. Ödeme bilgilerinizi güncelleyin.',
      actionUrl: '/hesabim/faturalarim',
    });
  }

  // ── PLAN PREVIEW (public) ─────────────────────────────────────────────────

  async getPlanPreview(planId: string) {
    const plan = await this.planRepository.findOne({
      where: { id: planId, status: MembershipPlanStatus.Published },
      relations: ['creator_profile'],
    });
    if (!plan) throw new NotFoundException('PLAN_NOT_FOUND');
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price_monthly_try: plan.price_monthly_try,
      perks: plan.perks,
      seller: {
        display_name: plan.creator_profile.display_name,
        username: plan.creator_profile.username,
      },
    };
  }

  async handleGatewayCancelled(gatewaySubscriptionId: string): Promise<void> {
    const sub = await this.subscriptionRepository.findOne({
      where: { gateway_subscription_id: gatewaySubscriptionId },
    });

    if (!sub || sub.status === MembershipSubscriptionStatus.Cancelled) return;

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.Cancelled,
        cancelled_at: new Date(),
      },
    );
  }

  // ── Pause / Resume ────────────────────────────────────────────────────────

  async pauseSubscription(fanUserId: string, subscriptionId: string, pauseDays = 30) {
    const sub = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, fan_user_id: fanUserId },
    });

    if (!sub) throw new NotFoundException('SUBSCRIPTION_NOT_FOUND');
    if (sub.status !== MembershipSubscriptionStatus.Active) {
      throw new ConflictException('SUBSCRIPTION_NOT_ACTIVE');
    }

    const now = new Date();
    const resumesAt = new Date(now.getTime() + pauseDays * 86400 * 1000);

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.Paused,
        paused_at: now,
        pause_resumes_at: resumesAt,
      },
    );

    return { subscription_id: sub.id, paused_at: now, pause_resumes_at: resumesAt };
  }

  async resumeSubscription(fanUserId: string, subscriptionId: string) {
    const sub = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId, fan_user_id: fanUserId },
    });

    if (!sub) throw new NotFoundException('SUBSCRIPTION_NOT_FOUND');
    if (sub.status !== MembershipSubscriptionStatus.Paused) {
      throw new ConflictException('SUBSCRIPTION_NOT_PAUSED');
    }

    await this.subscriptionRepository.update(
      { id: sub.id },
      {
        status: MembershipSubscriptionStatus.Active,
        paused_at: null,
        pause_resumes_at: null,
      },
    );

    return { subscription_id: sub.id, resumed_at: new Date() };
  }
}
