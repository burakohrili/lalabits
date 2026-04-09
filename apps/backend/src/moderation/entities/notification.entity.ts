import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum NotificationType {
  NewPostPublished = 'new_post_published',
  NewProductPublished = 'new_product_published',
  MembershipRenewalSuccess = 'membership_renewal_success',
  MembershipRenewalFailed = 'membership_renewal_failed',
  MembershipCancelledConfirmed = 'membership_cancelled_confirmed',
  MembershipExpired = 'membership_expired',
  CreatorApplicationApproved = 'creator_application_approved',
  CreatorApplicationRejected = 'creator_application_rejected',
  AdminBroadcast = 'admin_broadcast',
  OrderConfirmed = 'order_confirmed',
  ContentRemoved = 'content_removed',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  recipient_user_id: string;

  @Column({ type: 'enum', enum: NotificationType })
  notification_type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', nullable: true })
  action_url: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  read_at: Date | null;

  // Nullable — not all notifications have an actor (e.g. system events)
  @Column({ type: 'uuid', nullable: true })
  actor_user_id: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User, 'notifications')
  @JoinColumn({ name: 'recipient_user_id' })
  recipient_user: User;
}
