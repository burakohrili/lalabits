import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ModerationAction } from './moderation-action.entity';

export enum ReportTargetType {
  Post = 'post',
  Product = 'product',
  Collection = 'collection',
  User = 'user',
  CreatorProfile = 'creator_profile',
  ChatMessage = 'chat_message',
  CommunityMessage = 'community_message',
}

export enum ReportStatus {
  Open = 'open',
  UnderReview = 'under_review',
  Actioned = 'actioned',
  Dismissed = 'dismissed',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reporter_user_id: string;

  @Column({ type: 'enum', enum: ReportTargetType })
  target_type: ReportTargetType;

  // Polymorphic reference — no FK constraint; resolved at query time via target_type
  @Column({ type: 'uuid' })
  target_id: string;

  @Column()
  reason_code: string;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.Open })
  status: ReportStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_user_id' })
  reporter_user: User;

  @OneToMany(() => ModerationAction, (ma) => ma.report)
  moderation_actions: ModerationAction[];
}
