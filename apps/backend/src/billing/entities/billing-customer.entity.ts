import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { PaymentMethodSummary } from './payment-method-summary.entity';

@Entity('billing_customers')
export class BillingCustomer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @Column()
  gateway_customer_id: string;

  @Column()
  gateway_provider: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @OneToOne(() => User, 'billing_customer')
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PaymentMethodSummary, (pms) => pms.billing_customer)
  payment_methods: PaymentMethodSummary[];
}
