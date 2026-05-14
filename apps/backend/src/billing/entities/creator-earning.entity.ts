import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

export enum EarningSourceType {
  Subscription = 'subscription',
  Product = 'product',
  Collection = 'collection',
}

export enum EarningStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Paid = 'paid',
}

@Entity('creator_earnings')
export class CreatorEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column({ type: 'enum', enum: EarningSourceType })
  source_type: EarningSourceType;

  @Column({ type: 'uuid' })
  source_id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  gross_amount_try: number;

  @Column({ type: 'numeric', precision: 5, scale: 4, default: 0.20 })
  commission_rate: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  commission_amount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  net_amount_try: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'smallint', nullable: true })
  period_month: number | null;

  @Column({ type: 'smallint', nullable: true })
  period_year: number | null;

  @Column({ type: 'enum', enum: EarningStatus, default: EarningStatus.Pending })
  status: EarningStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;
}
