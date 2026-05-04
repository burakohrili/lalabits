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
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { MembershipPlan } from '../../creator/entities/membership-plan.entity';
import { PostAttachment } from './post-attachment.entity';

export enum PostPublishStatus {
  Draft = 'draft',
  Published = 'published',
  Scheduled = 'scheduled',
  Archived = 'archived',
}

export enum PostModerationStatus {
  Clean = 'clean',
  Flagged = 'flagged',
  Removed = 'removed',
}

export enum PostAccessLevel {
  Public = 'public',
  MemberOnly = 'member_only',
  TierGated = 'tier_gated',
  Premium = 'premium',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  content: object | null;

  @Column({
    type: 'enum',
    enum: PostPublishStatus,
    default: PostPublishStatus.Draft,
  })
  publish_status: PostPublishStatus;

  @Column({
    type: 'enum',
    enum: PostModerationStatus,
    default: PostModerationStatus.Clean,
  })
  moderation_status: PostModerationStatus;

  @Column({
    type: 'enum',
    enum: PostAccessLevel,
    default: PostAccessLevel.Public,
  })
  access_level: PostAccessLevel;

  @Column({ type: 'uuid', nullable: true })
  required_tier_id: string | null;

  @Column({ type: 'int', nullable: true })
  price_try: number | null;

  @Column({ type: 'varchar', nullable: true })
  cover_image_key: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  published_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  scheduled_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  flagged_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  removed_at: Date | null;

  // SECURITY: moderation_note is NEVER returned in fan or creator API responses
  @Column({ type: 'text', nullable: true, select: false })
  moderation_note: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => CreatorProfile, 'posts')
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  @OneToMany(() => PostAttachment, (pa) => pa.post)
  attachments: PostAttachment[];

  @ManyToOne(() => MembershipPlan, { nullable: true })
  @JoinColumn({ name: 'required_tier_id' })
  required_tier: MembershipPlan | null;
}
