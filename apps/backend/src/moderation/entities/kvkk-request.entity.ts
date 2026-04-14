import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum KvkkRequestType {
  DataAccess = 'data_access',
  DataDeletion = 'data_deletion',
  DataCorrection = 'data_correction',
  OptOut = 'opt_out',
  Other = 'other',
}

export enum KvkkRequestStatus {
  Pending = 'pending',
  InReview = 'in_review',
  Completed = 'completed',
  Rejected = 'rejected',
}

@Entity('kvkk_requests')
export class KvkkRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // nullable — anonymous submissions allowed
  @Column({ type: 'uuid', nullable: true })
  user_id: string | null;

  @Column({ length: 200 })
  full_name: string;

  @Column({ length: 300 })
  email: string;

  @Column({ type: 'enum', enum: KvkkRequestType })
  request_type: KvkkRequestType;

  @Column({ type: 'text', nullable: true })
  details: string | null;

  @Column({ type: 'enum', enum: KvkkRequestStatus, default: KvkkRequestStatus.Pending })
  status: KvkkRequestStatus;

  @Column({ type: 'text', nullable: true })
  admin_notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;
}
