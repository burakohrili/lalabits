import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { MembershipSubscription } from './membership-subscription.entity';
import { Order } from './order.entity';

export enum InvoiceType {
  SubscriptionCharge = 'subscription_charge',
  SubscriptionRenewal = 'subscription_renewal',
  OneTimePurchase = 'one_time_purchase', // covers product, collection, and premium post purchases
  Refund = 'refund',
}

export enum InvoiceStatus {
  Paid = 'paid',
  Failed = 'failed',
  Refunded = 'refunded',
}

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'uuid', nullable: true })
  membership_subscription_id: string | null;

  @Column({ type: 'uuid', nullable: true })
  order_id: string | null;

  @Column({ type: 'enum', enum: InvoiceType })
  invoice_type: InvoiceType;

  @Column({ type: 'int' })
  amount_try: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @Column({ type: 'varchar', nullable: true })
  gateway_invoice_id: string | null;

  @Column({ type: 'timestamptz' })
  issued_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fan_user_id' })
  fan_user: User;

  @ManyToOne(() => MembershipSubscription, (ms) => ms.invoices, { nullable: true })
  @JoinColumn({ name: 'membership_subscription_id' })
  membership_subscription: MembershipSubscription | null;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;
}
