import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillingCustomer } from './billing-customer.entity';

@Entity('payment_method_summaries')
export class PaymentMethodSummary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  billing_customer_id: string;

  @Column()
  gateway_payment_method_id: string;

  @Column()
  card_brand: string;

  @Column({ type: 'varchar', length: 4 })
  last_four: string;

  @Column({ type: 'int' })
  expiry_month: number;

  @Column({ type: 'int' })
  expiry_year: number;

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => BillingCustomer, (bc) => bc.payment_methods)
  @JoinColumn({ name: 'billing_customer_id' })
  billing_customer: BillingCustomer;
}
