import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

export enum ProductPublishStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum ProductModerationStatus {
  Clean = 'clean',
  Flagged = 'flagged',
  Removed = 'removed',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  price_try: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ProductPublishStatus,
    default: ProductPublishStatus.Draft,
  })
  publish_status: ProductPublishStatus;

  @Column({
    type: 'enum',
    enum: ProductModerationStatus,
    default: ProductModerationStatus.Clean,
  })
  moderation_status: ProductModerationStatus;

  // SECURITY: storage keys are NEVER exposed to frontend
  @Column({ select: false })
  file_storage_key: string;

  @Column({ type: 'varchar', select: false, nullable: true })
  preview_file_storage_key: string | null;

  @Column()
  original_filename: string;

  // bigint returns as string in TypeScript/JS
  @Column({ type: 'bigint' })
  file_size_bytes: string;

  @Column()
  content_type: string;

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
  @ManyToOne(() => CreatorProfile, 'products')
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;
}
