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
import { Invoice } from './invoice.entity';
import { MembershipSubscription } from './membership-subscription.entity';

export enum PaymentDisputeStatus {
  Open = 'open',
  UnderReview = 'under_review',
  ResolvedRefund = 'resolved_refund',
  ResolvedNoAction = 'resolved_no_action',
  Closed = 'closed',
}

@Entity('payment_disputes')
export class PaymentDispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  invoice_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  subscription_id: string | null;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'enum', enum: PaymentDisputeStatus, default: PaymentDisputeStatus.Open })
  status: PaymentDisputeStatus;

  @Column({ type: 'text', nullable: true })
  admin_notes: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fan_user_id' })
  fan_user: User;

  @ManyToOne(() => Invoice, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice | null;

  @ManyToOne(() => MembershipSubscription, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription: MembershipSubscription | null;
}
