import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreatorPayout } from './creator-payout.entity';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { User } from '../../auth/entities/user.entity';

export enum PayoutDocumentType {
  EFatura = 'e_fatura',
  EArsiv = 'e_arsiv',
  ESmm = 'e_smm',
  Other = 'other',
}

@Entity('payout_documents')
export class PayoutDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  payout_id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column({ type: 'enum', enum: PayoutDocumentType })
  document_type: PayoutDocumentType;

  @Column({ type: 'varchar' })
  file_key: string;

  @CreateDateColumn({ type: 'timestamptz' })
  uploaded_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  verified_at: Date | null;

  @Column({ type: 'uuid', nullable: true })
  verified_by: string | null;

  @ManyToOne(() => CreatorPayout, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payout_id' })
  payout: CreatorPayout;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verified_by_user: User | null;
}
