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
export class PauseResumeJob {
  private readonly logger = new Logger(PauseResumeJob.name);

  constructor(
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    private readonly notificationService: NotificationService,
  ) {}

  // Run every hour — resume paused subscriptions whose pause window has expired
  @Cron(CronExpression.EVERY_HOUR)
  async resumePausedSubscriptions(): Promise<void> {
    const now = new Date();

    const toResume = await this.subscriptionRepository.find({
      where: {
        status: MembershipSubscriptionStatus.Paused,
        pause_resumes_at: LessThan(now),
      },
    });

    if (toResume.length === 0) return;

    const ids = toResume.map((s) => s.id);

    await this.subscriptionRepository
      .createQueryBuilder()
      .update(MembershipSubscription)
      .set({
        status: MembershipSubscriptionStatus.Active,
        paused_at: null,
        pause_resumes_at: null,
      })
      .whereInIds(ids)
      .execute();

    this.logger.log(`Pause resume job: resumed ${ids.length} subscription(s)`);

    for (const sub of toResume) {
      await this.notificationService.createNotification({
        recipientUserId: sub.fan_user_id,
        type: NotificationType.MembershipResumed,
        title: 'Üyeliğiniz yeniden aktif',
        body: 'Duraklatma süresi sona erdi, üyeliğiniz otomatik olarak devam etti.',
        actionUrl: '/hesabim/faturalarim',
      });
    }
  }
}
