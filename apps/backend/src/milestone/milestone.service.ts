import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreatorMilestone } from './entities/creator-milestone.entity';
import { FanMilestone } from './entities/fan-milestone.entity';
import { MilestoneType } from './entities/milestone-type.enum';
import { MILESTONE_CONFIGS } from './milestone.config';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { User } from '../auth/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../moderation/entities/notification.entity';
import { EmailService } from '../email/email.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class MilestoneService {
  private readonly logger = new Logger(MilestoneService.name);

  constructor(
    @InjectRepository(CreatorMilestone)
    private readonly creatorMilestoneRepo: Repository<CreatorMilestone>,
    @InjectRepository(FanMilestone)
    private readonly fanMilestoneRepo: Repository<FanMilestone>,
    @InjectRepository(CreatorProfile)
    private readonly creatorRepo: Repository<CreatorProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
    private readonly storageService: StorageService,
    private readonly config: ConfigService,
  ) {}

  // ─── Public trigger points (called fire-and-forget from hooks) ────────────

  async checkAndTriggerForCreator(creatorProfileId: string): Promise<void> {
    const creator = await this.creatorRepo.findOne({
      where: { id: creatorProfileId },
      relations: ['user'],
    });
    if (!creator) return;

    const [supporterCount, totalEarningsTl, postCount] = await Promise.all([
      this.getCreatorSupporterCount(creatorProfileId),
      this.getCreatorTotalEarningsTl(creatorProfileId),
      this.getCreatorPostCount(creatorProfileId),
    ]);

    const checks: Array<{ type: MilestoneType; condition: boolean }> = [
      { type: MilestoneType.FIRST_SUPPORTER, condition: supporterCount >= 1 },
      { type: MilestoneType.TEN_SUPPORTERS, condition: supporterCount >= 10 },
      { type: MilestoneType.FIFTY_SUPPORTERS, condition: supporterCount >= 50 },
      { type: MilestoneType.HUNDRED_SUPPORTERS, condition: supporterCount >= 100 },
      { type: MilestoneType.FIVE_HUNDRED_SUPPORTERS, condition: supporterCount >= 500 },
      { type: MilestoneType.FIRST_POST, condition: postCount >= 1 },
      { type: MilestoneType.FIRST_1K_EARNED, condition: totalEarningsTl >= 1000 },
      { type: MilestoneType.FIRST_10K_EARNED, condition: totalEarningsTl >= 10000 },
      { type: MilestoneType.FIRST_100K_EARNED, condition: totalEarningsTl >= 100000 },
    ];

    for (const { type, condition } of checks) {
      if (condition) {
        await this.triggerCreatorMilestone(creator, type);
      }
    }
  }

  async checkAndTriggerForFan(fanUserId: string, relatedCreatorId?: string): Promise<void> {
    const fan = await this.userRepo.findOne({ where: { id: fanUserId } });
    if (!fan) return;

    const [lifetimeSpentTl, uniqueCreatorCount] = await Promise.all([
      this.getFanLifetimeSpentTl(fanUserId),
      this.getFanUniqueCreatorCount(fanUserId),
    ]);

    const globalChecks: Array<{ type: MilestoneType; condition: boolean }> = [
      { type: MilestoneType.FAN_FIRST_SUPPORT, condition: uniqueCreatorCount >= 1 },
      { type: MilestoneType.FAN_THREE_CREATORS, condition: uniqueCreatorCount >= 3 },
      { type: MilestoneType.FAN_TEN_CREATORS, condition: uniqueCreatorCount >= 10 },
      { type: MilestoneType.FAN_500_TL, condition: lifetimeSpentTl >= 500 },
      { type: MilestoneType.FAN_2000_TL, condition: lifetimeSpentTl >= 2000 },
      { type: MilestoneType.FAN_10000_TL, condition: lifetimeSpentTl >= 10000 },
    ];

    for (const { type, condition } of globalChecks) {
      if (condition) {
        await this.triggerFanMilestone(fan, type, null);
      }
    }
  }

  async checkLoyaltyMilestones(fanUserId: string): Promise<void> {
    const fan = await this.userRepo.findOne({ where: { id: fanUserId } });
    if (!fan) return;

    const subscriptions = await this.dataSource.query<
      Array<{ creator_profile_id: string; created_at: Date }>
    >(
      `SELECT ms.creator_profile_id, ms.created_at
       FROM membership_subscriptions ms
       WHERE ms.fan_user_id = $1
         AND ms.status IN ('active', 'cancelled', 'expired')
       GROUP BY ms.creator_profile_id, ms.created_at
       ORDER BY ms.created_at ASC`,
      [fanUserId],
    );

    for (const sub of subscriptions) {
      const monthsActive = this.monthsDiff(new Date(sub.created_at), new Date());

      const loyaltyChecks: Array<{ type: MilestoneType; months: number }> = [
        { type: MilestoneType.FAN_THREE_MONTHS, months: 3 },
        { type: MilestoneType.FAN_SIX_MONTHS, months: 6 },
        { type: MilestoneType.FAN_ONE_YEAR, months: 12 },
        { type: MilestoneType.FAN_ANNIVERSARY, months: 24 },
      ];

      for (const { type, months } of loyaltyChecks) {
        if (monthsActive >= months) {
          await this.triggerFanMilestone(fan, type, sub.creator_profile_id);
        }
      }
    }
  }

  async checkTimeMilestonesForCreator(creatorProfileId: string, createdAt: Date): Promise<void> {
    const creator = await this.creatorRepo.findOne({
      where: { id: creatorProfileId },
      relations: ['user'],
    });
    if (!creator) return;

    const monthsActive = this.monthsDiff(createdAt, new Date());

    const timeChecks: Array<{ type: MilestoneType; months: number }> = [
      { type: MilestoneType.ONE_MONTH, months: 1 },
      { type: MilestoneType.SIX_MONTHS, months: 6 },
      { type: MilestoneType.FIRST_YEAR, months: 12 },
    ];

    for (const { type, months } of timeChecks) {
      if (monthsActive >= months) {
        await this.triggerCreatorMilestone(creator, type);
      }
    }
  }

  async checkProductSoldMilestone(creatorProfileId: string): Promise<void> {
    const creator = await this.creatorRepo.findOne({
      where: { id: creatorProfileId },
      relations: ['user'],
    });
    if (!creator) return;

    await this.triggerCreatorMilestone(creator, MilestoneType.FIRST_PRODUCT_SOLD);
  }

  // ─── Core trigger logic ────────────────────────────────────────────────────

  private async triggerCreatorMilestone(
    creator: CreatorProfile & { user: User },
    type: MilestoneType,
  ): Promise<void> {
    const existing = await this.creatorMilestoneRepo.findOne({
      where: { creator_id: creator.id, type },
    });
    if (existing) return;

    const config = MILESTONE_CONFIGS[type];
    let certificateUrl: string | null = null;

    try {
      certificateUrl = await this.generateCertificate({
        displayName: creator.display_name,
        milestoneTitle: config.titleTr,
        palette: config.palette,
        earnedAt: new Date(),
      });
    } catch (err) {
      this.logger.error(`Certificate generation failed for creator ${creator.id} type ${type}: ${(err as Error).message}`);
    }

    const milestone = await this.creatorMilestoneRepo.save(
      this.creatorMilestoneRepo.create({
        creator_id: creator.id,
        type,
        certificate_url: certificateUrl,
        share_text: config.shareText,
        earned_at: new Date(),
        notified_at: null,
      }),
    );

    await this.notifyUser(creator.user.id, config.titleTr, creator.id, 'creator', certificateUrl);

    await this.creatorMilestoneRepo.update(milestone.id, { notified_at: new Date() });
  }

  private async triggerFanMilestone(
    fan: User,
    type: MilestoneType,
    relatedCreatorId: string | null,
  ): Promise<void> {
    const existing = await this.fanMilestoneRepo.findOne({
      where: { fan_id: fan.id, type, related_creator_id: relatedCreatorId ?? undefined },
    });
    if (existing) return;

    const config = MILESTONE_CONFIGS[type];
    let certificateUrl: string | null = null;

    try {
      certificateUrl = await this.generateCertificate({
        displayName: fan.display_name,
        milestoneTitle: config.titleTr,
        palette: config.palette,
        earnedAt: new Date(),
      });
    } catch (err) {
      this.logger.error(`Certificate generation failed for fan ${fan.id} type ${type}: ${(err as Error).message}`);
    }

    const milestone = await this.fanMilestoneRepo.save(
      this.fanMilestoneRepo.create({
        fan_id: fan.id,
        related_creator_id: relatedCreatorId,
        type,
        certificate_url: certificateUrl,
        share_text: config.shareText,
        earned_at: new Date(),
        notified_at: null,
      }),
    );

    await this.notifyUser(fan.id, config.titleTr, null, 'fan', certificateUrl);

    await this.fanMilestoneRepo.update(milestone.id, { notified_at: new Date() });
  }

  // ─── Certificate generation ────────────────────────────────────────────────

  private async generateCertificate(params: {
    displayName: string;
    milestoneTitle: string;
    palette: { bg: string; accent: string; text: string };
    earnedAt: Date;
  }): Promise<string> {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const internalSecret = this.config.get<string>('INTERNAL_API_SECRET') ?? '';

    const res = await fetch(`${frontendUrl}/api/milestones/certificate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': internalSecret,
      },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Certificate API returned ${res.status}`);
    }

    const { base64 } = (await res.json()) as { base64: string };
    const buffer = Buffer.from(base64, 'base64');
    const key = `milestones/certificates/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;

    return this.storageService.uploadBuffer(key, buffer, 'image/png');
  }

  // ─── Notification helper ───────────────────────────────────────────────────

  private async notifyUser(
    userId: string,
    milestoneTitle: string,
    creatorProfileId: string | null,
    role: 'creator' | 'fan',
    certificateUrl: string | null,
  ): Promise<void> {
    const actionUrl =
      role === 'creator' ? '/dashboard/milestones' : '/hesabim/milestones';

    await this.notificationService.createNotification({
      recipientUserId: userId,
      type: NotificationType.MilestoneUnlocked,
      title: `🎉 ${milestoneTitle} rozetini kazandın!`,
      body: 'Yeni bir dönüm noktasına ulaştın. Sertifikanı görüntüle ve paylaş!',
      actionUrl,
    });

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: { email: true },
      });
      if (user) {
        await this.emailService.sendMail(
          user.email,
          `🎉 Tebrikler! ${milestoneTitle} rozetini kazandın`,
          this.buildMilestoneEmailHtml(user.email, milestoneTitle, certificateUrl, actionUrl),
        );
      }
    } catch (err) {
      this.logger.error(`Milestone email failed for user ${userId}: ${(err as Error).message}`);
    }
  }

  private buildMilestoneEmailHtml(
    _email: string,
    milestoneTitle: string,
    certificateUrl: string | null,
    actionUrl: string,
  ): string {
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? 'https://lalabits.art';
    const certLink = certificateUrl
      ? `<p style="text-align:center;margin:24px 0"><a href="${certificateUrl}" style="display:inline-block;padding:12px 24px;background:#008080;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Sertifikanı İndir</a></p>`
      : '';

    return `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#f8f9fa">
        <h1 style="font-size:24px;color:#212121;text-align:center">🎉 Tebrikler!</h1>
        <p style="font-size:16px;color:#212121;text-align:center"><strong>${milestoneTitle}</strong> rozetini kazandın!</p>
        ${certLink}
        <p style="text-align:center"><a href="${frontendUrl}${actionUrl}" style="color:#008080">Rozetlerimi Gör →</a></p>
        <p style="font-size:12px;color:#6b7280;text-align:center;margin-top:32px">lalabits.art — Türkiye'nin yaratıcı platformu</p>
      </div>
    `;
  }

  // ─── Data queries ──────────────────────────────────────────────────────────

  private async getCreatorSupporterCount(creatorProfileId: string): Promise<number> {
    const result = await this.dataSource.query<[{ count: string }]>(
      `SELECT COUNT(DISTINCT fan_user_id)::text AS count
       FROM membership_subscriptions
       WHERE creator_profile_id = $1
         AND status IN ('active', 'cancelled', 'expired')`,
      [creatorProfileId],
    );
    return parseInt(result[0]?.count ?? '0', 10);
  }

  private async getCreatorTotalEarningsTl(creatorProfileId: string): Promise<number> {
    const result = await this.dataSource.query<[{ total: string }]>(
      `SELECT COALESCE(SUM(i.amount_try), 0)::text AS total
       FROM invoices i
       JOIN membership_subscriptions ms ON i.membership_subscription_id = ms.id
       WHERE ms.creator_profile_id = $1
         AND i.status = 'paid'`,
      [creatorProfileId],
    );
    return parseInt(result[0]?.total ?? '0', 10);
  }

  private async getCreatorPostCount(creatorProfileId: string): Promise<number> {
    const result = await this.dataSource.query<[{ count: string }]>(
      `SELECT COUNT(*)::text AS count
       FROM posts
       WHERE creator_profile_id = $1
         AND published_at IS NOT NULL
         AND deleted_at IS NULL`,
      [creatorProfileId],
    );
    return parseInt(result[0]?.count ?? '0', 10);
  }

  private async getFanLifetimeSpentTl(fanUserId: string): Promise<number> {
    const result = await this.dataSource.query<[{ total: string }]>(
      `SELECT COALESCE(SUM(amount_try), 0)::text AS total
       FROM invoices
       WHERE fan_user_id = $1
         AND status = 'paid'`,
      [fanUserId],
    );
    return parseInt(result[0]?.total ?? '0', 10);
  }

  private async getFanUniqueCreatorCount(fanUserId: string): Promise<number> {
    const result = await this.dataSource.query<[{ count: string }]>(
      `SELECT COUNT(DISTINCT creator_profile_id)::text AS count
       FROM membership_subscriptions
       WHERE fan_user_id = $1
         AND status IN ('active', 'cancelled', 'expired')`,
      [fanUserId],
    );
    return parseInt(result[0]?.count ?? '0', 10);
  }

  // ─── Utility ───────────────────────────────────────────────────────────────

  private monthsDiff(from: Date, to: Date): number {
    return (
      (to.getFullYear() - from.getFullYear()) * 12 +
      (to.getMonth() - from.getMonth())
    );
  }

  // ─── Public read API ───────────────────────────────────────────────────────

  async getCreatorMilestones(creatorProfileId: string): Promise<CreatorMilestone[]> {
    return this.creatorMilestoneRepo.find({
      where: { creator_id: creatorProfileId },
      order: { earned_at: 'DESC' },
    });
  }

  async getCreatorMilestonesForUser(userId: string): Promise<CreatorMilestone[]> {
    const creator = await this.creatorRepo.findOne({ where: { user_id: userId } });
    if (!creator) return [];
    return this.getCreatorMilestones(creator.id);
  }

  async getFanMilestones(fanUserId: string): Promise<FanMilestone[]> {
    return this.fanMilestoneRepo.find({
      where: { fan_id: fanUserId },
      order: { earned_at: 'DESC' },
    });
  }
}
