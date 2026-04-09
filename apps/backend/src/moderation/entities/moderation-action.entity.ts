import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Report } from './report.entity';

export enum ModerationTargetType {
  Post = 'post',
  Product = 'product',
  Collection = 'collection',
  User = 'user',
  CreatorProfile = 'creator_profile',
}

export enum ModerationActionType {
  WarnUser = 'warn_user',
  RestrictCreator = 'restrict_creator',
  RemoveContent = 'remove_content',
  RestoreContent = 'restore_content',
  DismissReport = 'dismiss_report',
  ApproveCreator = 'approve_creator',
  RejectCreator = 'reject_creator',
  SuspendCreator = 'suspend_creator',
  UnsuspendCreator = 'unsuspend_creator',
}

// Append-only audit record — no updated_at by design
@Entity('moderation_actions')
export class ModerationAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  admin_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  report_id: string | null;

  @Column({ type: 'enum', enum: ModerationTargetType })
  target_type: ModerationTargetType;

  // Polymorphic reference — no FK constraint; resolved at query time via target_type
  @Column({ type: 'uuid' })
  target_id: string;

  @Column({ type: 'enum', enum: ModerationActionType })
  action_type: ModerationActionType;

  // SECURITY: admin_note is NEVER returned in any non-admin API response
  @Column({ type: 'text', nullable: true, select: false })
  admin_note: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'admin_user_id' })
  admin_user: User;

  @ManyToOne(() => Report, (r) => r.moderation_actions, { nullable: true })
  @JoinColumn({ name: 'report_id' })
  report: Report | null;
}
