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

@Entity('subscription_consents')
export class SubscriptionConsent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id', type: 'uuid' })
  subscription_id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({ name: 'consent_version', type: 'varchar' })
  consent_version: string;

  @Column({ name: 'consented_at', type: 'timestamptz' })
  consented_at: Date;

  @Column({ name: 'billing_descriptor', type: 'varchar', nullable: true })
  billing_descriptor: string | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ip_address: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  user_agent: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => MembershipSubscription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: MembershipSubscription;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
