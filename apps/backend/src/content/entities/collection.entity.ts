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
import { CollectionItem } from './collection-item.entity';

export enum CollectionAccessType {
  Purchase = 'purchase',
  TierGated = 'tier_gated',
}

export enum CollectionPublishStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum CollectionModerationStatus {
  Clean = 'clean',
  Flagged = 'flagged',
  Removed = 'removed',
}

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: CollectionAccessType })
  access_type: CollectionAccessType;

  @Column({ type: 'int', nullable: true })
  price_try: number | null;

  @Column({ type: 'uuid', nullable: true })
  required_tier_id: string | null;

  @Column({
    type: 'enum',
    enum: CollectionPublishStatus,
    default: CollectionPublishStatus.Draft,
  })
  publish_status: CollectionPublishStatus;

  @Column({
    type: 'enum',
    enum: CollectionModerationStatus,
    default: CollectionModerationStatus.Clean,
  })
  moderation_status: CollectionModerationStatus;

  // Denormalized count — updated on CollectionItem add/remove
  @Column({ default: 0 })
  item_count: number;

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
  @ManyToOne(() => CreatorProfile, 'collections')
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  @ManyToOne(() => MembershipPlan, { nullable: true })
  @JoinColumn({ name: 'required_tier_id' })
  required_tier: MembershipPlan | null;

  @OneToMany(() => CollectionItem, (ci) => ci.collection)
  items: CollectionItem[];
}
