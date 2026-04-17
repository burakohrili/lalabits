import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum CreatorProfileStatus {
  Onboarding = 'onboarding',
  PendingReview = 'pending_review',
  Approved = 'approved',
  Rejected = 'rejected',
  Suspended = 'suspended',
}

export enum CreatorCategory {
  Writer = 'writer',
  Illustrator = 'illustrator',
  Educator = 'educator',
  Podcaster = 'podcaster',
  Musician = 'musician',
  Designer = 'designer',
  Developer = 'developer',
  VideoCreator = 'video_creator',
  AiCreator = 'ai_creator',
  GameDeveloper = 'game_developer',
  Designer3d = 'designer_3d',
  Other = 'other',
}

@Entity('creator_profiles')
export class CreatorProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  // Nullable until onboarding step 1 — set by creator during wizard
  @Column({ type: 'varchar', unique: true, nullable: true })
  username: string | null;

  @Column()
  display_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'varchar', nullable: true })
  cover_image_url: string | null;

  // Defaults to 'other' until creator selects their category in onboarding
  @Column({ type: 'enum', enum: CreatorCategory, default: CreatorCategory.Other })
  category: CreatorCategory;

  @Column({ type: 'text', array: true, default: '{}' })
  content_format_tags: string[];

  @Column({
    type: 'enum',
    enum: CreatorProfileStatus,
    default: CreatorProfileStatus.Onboarding,
  })
  status: CreatorProfileStatus;

  @Column({ default: 0 })
  onboarding_last_step: number;

  @Column({ type: 'timestamptz', nullable: true })
  approved_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  suspended_at: Date | null;

  // ─── Payout ───────────────────────────────────────────────────────────────
  // SECURITY: payout_iban_encrypted is NEVER selected in any default query result
  @Column({ type: 'varchar', nullable: true, select: false })
  payout_iban_encrypted: string | null;

  @Column({ type: 'varchar', length: 4, nullable: true })
  payout_iban_last_four: string | null;

  @Column({ type: 'boolean', nullable: true })
  payout_iban_format_valid: boolean | null;

  @Column({ type: 'jsonb', nullable: true })
  social_links: {
    youtube?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    discord?: string | null;
    tiktok?: string | null;
    website?: string | null;
  } | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany('MembershipPlan', 'creator_profile')
  membership_plans: unknown[];

  // Cross-domain inverse relations (string refs — entities defined in other domains)
  @OneToMany('Post', 'creator_profile')
  posts: unknown[];

  @OneToMany('Product', 'creator_profile')
  products: unknown[];

  @OneToMany('Collection', 'creator_profile')
  collections: unknown[];

  @OneToMany('MembershipSubscription', 'creator_profile')
  subscriptions: unknown[];
}
