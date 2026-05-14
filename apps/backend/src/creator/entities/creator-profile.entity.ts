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

  // ─── Yasal Kimlik & Fatura Bilgileri ────────────────────────────────────────
  @Column({ name: 'legal_full_name', type: 'varchar', nullable: true })
  legal_full_name: string | null;

  // SECURITY: AES-256-GCM ile şifreli — ham değer log ve response'a yazılmaz
  @Column({ name: 'tc_identity_number_encrypted', type: 'varchar', nullable: true, select: false })
  tc_identity_number_encrypted: string | null;

  @Column({ name: 'tax_number', type: 'varchar', nullable: true })
  tax_number: string | null;

  @Column({ name: 'phone_number', type: 'varchar', nullable: true })
  phone_number: string | null;

  @Column({ name: 'full_address', type: 'text', nullable: true })
  full_address: string | null;

  @Column({ name: 'city', type: 'varchar', nullable: true })
  city: string | null;

  @Column({ name: 'postal_code', type: 'varchar', nullable: true })
  postal_code: string | null;

  @Column({ name: 'entity_type', type: 'varchar', default: 'individual' })
  entity_type: 'individual' | 'sole_trader' | 'company';

  @Column({ name: 'company_name', type: 'varchar', nullable: true })
  company_name: string | null;

  @Column({ name: 'billing_info_completed_at', type: 'timestamptz', nullable: true })
  billing_info_completed_at: Date | null;

  // "LALABITS*@username" formatı — kart ekstresi için, max 22 karakter
  @Column({ name: 'billing_descriptor', type: 'varchar', nullable: true })
  billing_descriptor: string | null;

  @Column({ type: 'int', nullable: true })
  creator_rank: number | null;

  // ─── Payout / Tax ─────────────────────────────────────────────────────────
  @Column({ type: 'boolean', default: false })
  paid_sales_enabled: boolean;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  tax_document_status: string;

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
