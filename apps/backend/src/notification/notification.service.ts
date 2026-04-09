import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Notification, NotificationType } from '../moderation/entities/notification.entity';

export interface CreateNotificationInput {
  recipientUserId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string | null;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
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
    } catch (err) {
      this.logger.error(`Failed to create notification for user ${input.recipientUserId}: ${String(err)}`);
    }
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
    if (notification.read_at) return; // already read — idempotent
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
}
