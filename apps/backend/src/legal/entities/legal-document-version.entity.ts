import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

export enum LegalDocumentType {
  TermsOfService = 'terms_of_service',
  PrivacyPolicy = 'privacy_policy',
  CreatorAgreement = 'creator_agreement',
}

@Entity('legal_document_versions')
export class LegalDocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LegalDocumentType })
  document_type: LegalDocumentType;

  // Human-readable version label, e.g. "2026-03-01" — displayed as "Son güncelleme"
  @Column()
  version_identifier: string;

  @Column({ type: 'date' })
  effective_date: string;

  // Only one record per document_type may have is_current = true
  @Column({ default: false })
  is_current: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  // String ref to break circular import with consent-record.entity.ts
  @OneToMany('ConsentRecord', 'legal_document_version')
  consent_records: unknown[];
}
