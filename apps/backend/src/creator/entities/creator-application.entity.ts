import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreatorProfile } from './creator-profile.entity';

export enum CreatorApplicationDecision {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Entity('creator_applications')
export class CreatorApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column({ type: 'timestamptz' })
  submitted_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by_admin_id: string | null;

  @Column({
    type: 'enum',
    enum: CreatorApplicationDecision,
    default: CreatorApplicationDecision.Pending,
  })
  decision: CreatorApplicationDecision;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  // SECURITY: iban_encrypted is NEVER selected in any default query result
  @Column({ select: false })
  iban_encrypted: string;

  @Column()
  iban_format_valid: boolean;

  @Column({ type: 'varchar', length: 4, nullable: true })
  iban_last_four: string | null;

  @Column({ type: 'uuid' })
  agreement_version_id: string;

  @Column({ type: 'timestamptz' })
  agreement_accepted_at: Date;

  @Column({ default: 0 })
  resubmission_count: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => CreatorProfile)
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  // Cross-domain FK (string ref — LegalDocumentVersion defined in legal domain)
  @ManyToOne('LegalDocumentVersion')
  @JoinColumn({ name: 'agreement_version_id' })
  agreement_version: unknown;
}
