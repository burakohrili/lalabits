import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification, NotificationType } from '../moderation/entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { EmailService } from '../email/email.service';
import { User } from '../auth/entities/user.entity';

export interface CreateNotificationInput {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string | null;
  // Optional metadata for email dispatch
  emailMeta?: Record<string, string>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  // Best-effort: caller wraps in try/catch if needed — failure never propagates to parent transaction
  async createNotification(input: CreateNotificationInput): Promise<void> {
    try {
      await this.notificationRepository.save(
        this.notificationRepository.create({
          recipient_user_id: input.recipientUserId,
          notification_type: input.type,
          title: input.title,
          body: input.body,
          action_url: input.actionUrl ?? null,
          read_at: null,
          actor_user_id: null,
          metadata: null,
        }),
      );

      // Email dispatch — best-effort, never throws
      void this.dispatchEmail(input).catch((err) =>
        this.logger.error(`Email dispatch failed for user ${input.recipientUserId}: ${String(err)}`),
      );
    } catch (err) {
      this.logger.error(`Failed to create notification for user ${input.recipientUserId}: ${String(err)}`);
    }
  }

  private async dispatchEmail(input: CreateNotificationInput): Promise<void> {
    const shouldSend = await this.shouldSendEmail(input.recipientUserId, input.type);
    if (!shouldSend) return;

    const user = await this.userRepository.findOne({
      where: { id: input.recipientUserId },
      select: { email: true },
      withDeleted: false,
    });
    if (!user) return;

    const meta = input.emailMeta ?? {};

    switch (input.type) {
      case NotificationType.MembershipRenewalSuccess:
        await this.emailService.sendMembershipRenewalSuccess(
          user.email,
          meta.creatorName ?? '',
          meta.planName ?? '',
          meta.nextBillingDate ?? '',
        );
        break;
      case NotificationType.MembershipRenewalFailed:
        await this.emailService.sendMembershipRenewalFailed(
          user.email,
          meta.creatorName ?? '',
          meta.planName ?? '',
        );
        break;
      case NotificationType.MembershipCancelledConfirmed:
        await this.emailService.sendMembershipCancelled(
          user.email,
          meta.creatorName ?? '',
          meta.planName ?? '',
          meta.accessUntil ?? '',
        );
        break;
      case NotificationType.MembershipExpired:
        await this.emailService.sendMembershipExpired(user.email, meta.creatorName ?? '');
        break;
      case NotificationType.OrderConfirmed:
        await this.emailService.sendOrderConfirmed(
          user.email,
          meta.productTitle ?? '',
          meta.downloadUrl,
        );
        break;
      case NotificationType.ContentRemoved:
        await this.emailService.sendContentRemoved(
          user.email,
          meta.contentTitle ?? '',
          meta.reason,
        );
        break;
      case NotificationType.NewPostPublished:
        if (meta.postUrl) {
          await this.emailService.sendNewPostNotification(
            user.email,
            meta.creatorName ?? '',
            meta.postTitle ?? input.title,
            meta.postUrl,
          );
        }
        break;
      default:
        // No email template for other types
        break;
    }
  }

  private async shouldSendEmail(userId: string, type: NotificationType): Promise<boolean> {
    const pref = await this.preferenceRepository.findOne({
      where: { user_id: userId, notification_type: type },
    });
    // If no preference row exists, default is true
    return pref ? pref.email_enabled : true;
  }

  async listNotifications(userId: string, page: number, limit: number) {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const safePage = Math.max(1, page);

    const [items, total] = await this.notificationRepository.findAndCount({
      where: { recipient_user_id: userId },
      order: { created_at: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { recipient_user_id: userId, read_at: IsNull() },
    });

    return {
      items: items.map((n) => ({
        id: n.id,
        notification_type: n.notification_type,
        title: n.title,
        body: n.body,
        action_url: n.action_url,
        read_at: n.read_at,
        created_at: n.created_at,
      })),
      total,
      page: safePage,
      limit: safeLimit,
      unread_count: unreadCount,
    };
  }

  async getUnreadCount(userId: string): Promise<{ unread_count: number }> {
    const count = await this.notificationRepository.count({
      where: { recipient_user_id: userId, read_at: IsNull() },
    });
    return { unread_count: count };
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipient_user_id: userId },
    });
    if (!notification) throw new NotFoundException('NOTIFICATION_NOT_FOUND');
    if (notification.read_at) return;
    await this.notificationRepository.update(
      { id: notificationId },
      { read_at: new Date() },
    );
  }

  async markAllRead(userId: string): Promise<{ updated: number }> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read_at: new Date() })
      .where('recipient_user_id = :userId AND read_at IS NULL', { userId })
      .execute();

    return { updated: result.affected ?? 0 };
  }

  // ── Notification Preferences ───────────────────────────────────────────────

  async getPreferences(userId: string) {
    const prefs = await this.preferenceRepository.find({ where: { user_id: userId } });
    const prefMap = new Map(prefs.map((p) => [p.notification_type, p]));
    const allTypes = Object.values(NotificationType);

    return {
      preferences: allTypes.map((type) => {
        const found = prefMap.get(type);
        return {
          notification_type: type,
          email_enabled: found ? found.email_enabled : true,
          in_app_enabled: found ? found.in_app_enabled : true,
        };
      }),
    };
  }

  async updatePreferences(
    userId: string,
    updates: Array<{
      notification_type: NotificationType;
      email_enabled?: boolean;
      in_app_enabled?: boolean;
    }>,
  ) {
    const entities = updates.map((u) =>
      this.preferenceRepository.create({
        user_id: userId,
        notification_type: u.notification_type,
        email_enabled: u.email_enabled ?? true,
        in_app_enabled: u.in_app_enabled ?? true,
      }),
    );
    await this.preferenceRepository.upsert(entities, {
      conflictPaths: ['user_id', 'notification_type'],
    });

    return this.getPreferences(userId);
  }
}
