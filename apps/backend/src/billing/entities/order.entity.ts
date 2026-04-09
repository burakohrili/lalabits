import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum OrderType {
  MembershipCheckout = 'membership_checkout',
  ProductPurchase = 'product_purchase',
  CollectionPurchase = 'collection_purchase',
  PremiumPostPurchase = 'premium_post_purchase',
}

export enum OrderStatus {
  Pending = 'pending',       // checkout submitted; payment not yet confirmed
  Completed = 'completed',   // payment confirmed via gateway webhook
  Failed = 'failed',         // payment failed — no MembershipSubscription created
  Refunded = 'refunded',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'enum', enum: OrderType })
  order_type: OrderType;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Pending,
  })
  status: OrderStatus;

  @Column({ type: 'int' })
  amount_try: number;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  gateway_transaction_id: string | null;

  // Set at checkout form init; used to match İyzico callback token to this order
  @Column({ type: 'varchar', nullable: true, unique: true })
  gateway_conversation_id: string | null;

  // Polymorphic reference — resolved at query time via order_type; no FK constraint
  @Column({ type: 'uuid' })
  reference_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date | null;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fan_user_id' })
  fan_user: User;
}
