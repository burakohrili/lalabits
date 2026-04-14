import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { MembershipPlan } from '../../creator/entities/membership-plan.entity';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { Invoice } from './invoice.entity';

export enum BillingInterval {
  Monthly = 'monthly',
  Annual = 'annual',
}

export enum MembershipSubscriptionStatus {
  Pending = 'pending',       // checkout submitted; awaiting payment confirmation
  Active = 'active',         // current period paid; fan has full tier entitlement
  Cancelled = 'cancelled',   // fan cancelled; access continues until current_period_end
  GracePeriod = 'grace_period', // renewal failed; access continues until grace_period_ends_at
  Expired = 'expired',       // period ended or grace expired; access revoked
  Paused = 'paused',         // fan paused; access suspended until pause_resumes_at
}

@Entity('membership_subscriptions')
export class MembershipSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_user_id: string;

  @Column({ type: 'uuid' })
  membership_plan_id: string;

  // Denormalized for query efficiency — set from MembershipPlan.creator_profile_id at creation
  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column({ type: 'enum', enum: BillingInterval })
  billing_interval: BillingInterval;

  @Column({
    type: 'enum',
    enum: MembershipSubscriptionStatus,
    default: MembershipSubscriptionStatus.Pending,
  })
  status: MembershipSubscriptionStatus;

  @Column({ type: 'timestamptz' })
  current_period_start: Date;

  @Column({ type: 'timestamptz' })
  current_period_end: Date;

  @Column({ type: 'timestamptz', nullable: true })
  cancelled_at: Date | null;

  @Column({ type: 'text', nullable: true })
  cancellation_reason: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  grace_period_ends_at: Date | null;

  @Column({ type: 'varchar', nullable: true })
  gateway_subscription_id: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  paused_at: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  pause_resumes_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => User, 'subscriptions')
  @JoinColumn({ name: 'fan_user_id' })
  fan_user: User;

  @ManyToOne(() => MembershipPlan, 'subscriptions')
  @JoinColumn({ name: 'membership_plan_id' })
  membership_plan: MembershipPlan;

  @ManyToOne(() => CreatorProfile, 'subscriptions')
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  @OneToMany(() => Invoice, (inv) => inv.membership_subscription)
  invoices: Invoice[];
}
