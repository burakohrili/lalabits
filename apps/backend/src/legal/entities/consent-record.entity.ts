import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { LegalDocumentVersion, LegalDocumentType } from './legal-document-version.entity';

export enum ConsentMethod {
  FanSignupEmail = 'fan_signup_email',
  FanSignupGoogle = 'fan_signup_google',
  CreatorSignupEmail = 'creator_signup_email',
  CreatorSignupGoogle = 'creator_signup_google',
  OnboardingAgreementStep = 'onboarding_agreement_step',
}

@Entity('consent_records')
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  // Denormalized from legal_document_version for direct query filtering without join
  @Column({ type: 'enum', enum: LegalDocumentType })
  document_type: LegalDocumentType;

  @Column({ type: 'uuid' })
  legal_document_version_id: string;

  @Column({ type: 'timestamptz' })
  consented_at: Date;

  @Column({ type: 'enum', enum: ConsentMethod })
  consent_method: ConsentMethod;

  // Stored for KVKK audit trail
  @Column({ type: 'varchar', nullable: true })
  ip_address: string | null;

  // Immutable — no updated_at; append-only audit record
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User, 'consent_records')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => LegalDocumentVersion, (ldv) => ldv.consent_records)
  @JoinColumn({ name: 'legal_document_version_id' })
  legal_document_version: LegalDocumentVersion;
}
