import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Product } from '../../content/entities/product.entity';
import { Order } from './order.entity';

@Entity('product_purchases')
export class ProductPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'uuid' })
  order_id: string;

  @Column({ type: 'int' })
  amount_paid_try: number;

  @Column({ type: 'timestamptz' })
  purchased_at: Date;

  // Null = access valid; set if access is revoked (per OD-01 resolution)
  @Column({ type: 'timestamptz', nullable: true })
  access_revoked_at: Date | null;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User)
  @JoinColumn({ name: 'fan_user_id' })
  fan_user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
