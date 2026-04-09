import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import {
  MembershipSubscription,
  MembershipSubscriptionStatus,
} from '../entities/membership-subscription.entity';
import { NotificationService } from '../../notification/notification.service';
import { NotificationType } from '../../moderation/entities/notification.entity';

@Injectable()
export class GraceExpiryJob {
  private readonly logger = new Logger(GraceExpiryJob.name);

  constructor(
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    private readonly notificationService: NotificationService,
  ) {}

  // Run every hour — expire grace_period subscriptions whose grace window has passed
  @Cron(CronExpression.EVERY_HOUR)
  async expireGraceSubscriptions(): Promise<void> {
    const now = new Date();

    const expired = await this.subscriptionRepository.find({
      where: {
        status: MembershipSubscriptionStatus.GracePeriod,
        grace_period_ends_at: LessThan(now),
      },
    });

    if (expired.length === 0) return;

    const ids = expired.map((s) => s.id);

    await this.subscriptionRepository
      .createQueryBuilder()
      .update(MembershipSubscription)
      .set({ status: MembershipSubscriptionStatus.Expired })
      .whereInIds(ids)
      .execute();

    this.logger.log(`Grace expiry job: expired ${ids.length} subscription(s)`);

    // Notify each expired fan — best-effort, individual per fan
    for (const sub of expired) {
      await this.notificationService.createNotification({
        recipientUserId: sub.fan_user_id,
        type: NotificationType.MembershipExpired,
        title: 'Üyeliğiniz sona erdi',
        body: 'Üyelik dönem sonunda yenilenemedi ve erişim kapatıldı.',
        actionUrl: '/uyeliklerim',
      });
    }
  }
}
