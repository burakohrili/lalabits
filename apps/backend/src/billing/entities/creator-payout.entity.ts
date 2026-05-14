import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

export enum PayoutStatus {
  Pending = 'pending',
  Processing = 'processing',
  Paid = 'paid',
  Failed = 'failed',
}

@Entity('creator_payouts')
export class CreatorPayout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column({ type: 'smallint' })
  period_month: number;

  @Column({ type: 'smallint' })
  period_year: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_earnings_try: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_commission_try: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  net_payout_try: number;

  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.Pending })
  status: PayoutStatus;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  @OneToMany('PayoutDocument', 'payout')
  documents: unknown[];
}
