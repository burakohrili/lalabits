import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Post } from '../../content/entities/post.entity';
import { Order } from './order.entity';

@Entity('post_purchases')
export class PostPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'uuid' })
  post_id: string;

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

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
