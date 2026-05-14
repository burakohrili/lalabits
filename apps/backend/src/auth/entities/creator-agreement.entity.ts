import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

@Entity('creator_agreements')
export class CreatorAgreement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creator_id: string;

  @Column({ name: 'agreement_version', type: 'varchar' })
  agreement_version: string;

  @Column({ name: 'agreed_at', type: 'timestamptz' })
  agreed_at: Date;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ip_address: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ name: 'agreement_hash', type: 'varchar' })
  agreement_hash: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: CreatorProfile;
}
