import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { createHmac } from 'crypto';
import {
  MembershipSubscription,
  MembershipSubscriptionStatus,
} from '../entities/membership-subscription.entity';
import { User } from '../../auth/entities/user.entity';
import { EmailService } from '../../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RenewalReminderJob {
  private readonly logger = new Logger(RenewalReminderJob.name);

  constructor(
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // Daily at 09:00 Turkey time (UTC+3 = 06:00 UTC)
  @Cron('0 6 * * *')
  async sendRenewalReminders(): Promise<void> {
    const now = new Date();
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);

    const in4Days = new Date(now);
    in4Days.setDate(in4Days.getDate() + 4);

    // Active subscriptions renewing within 3-4 days that haven't received a reminder yet
    const subs = await this.subscriptionRepository.find({
      where: {
        status: MembershipSubscriptionStatus.Active,
        current_period_end: LessThan(in4Days),
        last_reminder_sent_at: IsNull(),
      },
      relations: ['fan_user', 'membership_plan', 'creator_profile'],
    });

    const eligible = subs.filter((s) => s.current_period_end > in3Days);

    if (eligible.length === 0) return;

    this.logger.log(`Sending renewal reminders for ${eligible.length} subscriptions`);

    for (const sub of eligible) {
      try {
        if (!sub.fan_user?.email) continue;

        const renewalDate = sub.current_period_end.toLocaleDateString('tr-TR');
        const secret = this.configService.get<string>('CANCEL_TOKEN_SECRET', 'cancel-secret-change-me');
        const cancelToken = createHmac('sha256', secret).update(sub.id).digest('hex');
        const baseUrl = process.env.FRONTEND_URL ?? 'https://lalabits.art';
        const cancelUrl = `${baseUrl}/hesabim/uyelikler?cancel_token=${cancelToken}&sub=${sub.id}`;

        await this.emailService.sendRenewalReminderEmail(
          sub.fan_user.email,
          sub.creator_profile?.display_name ?? 'Üretici',
          sub.membership_plan?.name ?? 'Üyelik',
          renewalDate,
          cancelUrl,
        );

        await this.subscriptionRepository.update(
          { id: sub.id },
          { last_reminder_sent_at: now },
        );
      } catch (err) {
        this.logger.error(`Renewal reminder failed for sub ${sub.id}: ${(err as Error).message}`);
      }
    }
  }
}
