import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceType } from './entities/invoice.entity';
import { MembershipSubscription } from './entities/membership-subscription.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { PaymentDispute, PaymentDisputeStatus } from './entities/payment-dispute.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(PaymentDispute)
    private readonly disputeRepository: Repository<PaymentDispute>,
  ) {}

  async listInvoices(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const [invoices, total] = await this.invoiceRepository.findAndCount({
      where: { fan_user_id: userId },
      order: { issued_at: 'DESC' },
      skip: offset,
      take: limit,
    });

    // Resolve creator name for subscription-linked invoices
    const subIds = invoices
      .filter((inv) => inv.membership_subscription_id)
      .map((inv) => inv.membership_subscription_id!);

    const subMap = new Map<string, { creator_display_name: string | null; creator_username: string | null }>();

    if (subIds.length > 0) {
      const subs = await this.subscriptionRepository
        .createQueryBuilder('sub')
        .leftJoinAndSelect('sub.creator_profile', 'creator')
        .where('sub.id IN (:...ids)', { ids: subIds })
        .getMany();

      for (const sub of subs) {
        const profile = sub.creator_profile as CreatorProfile | null;
        subMap.set(sub.id, {
          creator_display_name: profile?.display_name ?? null,
          creator_username: profile?.username ?? null,
        });
      }
    }

    const items = invoices.map((inv) => {
      const subInfo = inv.membership_subscription_id
        ? subMap.get(inv.membership_subscription_id) ?? null
        : null;

      return {
        id: inv.id,
        invoice_type: inv.invoice_type,
        label: this.resolveLabel(inv.invoice_type),
        amount_try: inv.amount_try,
        currency: inv.currency,
        status: inv.status,
        issued_at: inv.issued_at,
        paid_at: inv.paid_at,
        creator_display_name: subInfo?.creator_display_name ?? null,
        creator_username: subInfo?.creator_username ?? null,
      };
    });

    return { items, total, page, limit };
  }

  private resolveLabel(invoiceType: InvoiceType): string {
    switch (invoiceType) {
      case InvoiceType.SubscriptionCharge:
        return 'Üyelik Başlangıç';
      case InvoiceType.SubscriptionRenewal:
        return 'Üyelik Yenileme';
      case InvoiceType.OneTimePurchase:
        return 'Satın Alma';
      case InvoiceType.Refund:
        return 'İade';
      default:
        return 'Ödeme';
    }
  }

  // ── Payment Disputes ──────────────────────────────────────────────────────

  async createDispute(fanUserId: string, dto: CreateDisputeDto): Promise<PaymentDispute> {
    const dispute = this.disputeRepository.create({
      fan_user_id: fanUserId,
      invoice_id: dto.invoice_id ?? null,
      subscription_id: dto.subscription_id ?? null,
      reason: dto.reason,
      status: PaymentDisputeStatus.Open,
    });
    return this.disputeRepository.save(dispute);
  }

  async listFanDisputes(fanUserId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const [items, total] = await this.disputeRepository.findAndCount({
      where: { fan_user_id: fanUserId },
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async adminListDisputes(status?: PaymentDisputeStatus, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const qb = this.disputeRepository
      .createQueryBuilder('d')
      .leftJoin('d.fan_user', 'fan')
      .addSelect(['fan.email'])
      .orderBy('d.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (status) {
      qb.where('d.status = :status', { status });
    }

    const [disputes, total] = await qb.getManyAndCount();

    const items = disputes.map((d) => ({
      id: d.id,
      fan_email: d.fan_user?.email ?? null,
      invoice_id: d.invoice_id,
      subscription_id: d.subscription_id,
      reason: d.reason,
      status: d.status,
      admin_notes: d.admin_notes,
      created_at: d.created_at,
    }));

    return { items, total, page, limit };
  }

  async adminUpdateDispute(id: string, dto: UpdateDisputeDto): Promise<PaymentDispute> {
    const dispute = await this.disputeRepository.findOne({ where: { id } });
    if (!dispute) throw new NotFoundException('DISPUTE_NOT_FOUND');

    dispute.status = dto.status;
    if (dto.admin_notes !== undefined) dispute.admin_notes = dto.admin_notes;

    return this.disputeRepository.save(dispute);
  }
}
