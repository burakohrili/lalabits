import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

export enum RiskEventType {
  Chargeback = 'chargeback',
  FraudFlag = 'fraud_flag',
  Dispute = 'dispute',
  SuspiciousLogin = 'suspicious_login',
  PayoutHold = 'payout_hold',
}

export enum RiskSeverity {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical',
}

@Entity('risk_events')
export class RiskEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  creator_profile_id: string | null;

  @Column({ type: 'enum', enum: RiskEventType })
  event_type: RiskEventType;

  @Column({ type: 'enum', enum: RiskSeverity, default: RiskSeverity.Medium })
  severity: RiskSeverity;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  resolved: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  resolved_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToOne(() => CreatorProfile, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile | null;
}
