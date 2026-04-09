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
import { CreatorProfile } from './creator-profile.entity';

export enum MembershipPlanStatus {
  Draft = 'draft',
  Published = 'published',
  Hidden = 'hidden',
  Archived = 'archived',
}

@Entity('membership_plans')
export class MembershipPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_profile_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  price_monthly_try: number;

  @Column({ type: 'int', nullable: true })
  price_annual_try: number | null;

  @Column({ default: 'TRY' })
  currency: string;

  @Column({ type: 'int' })
  tier_rank: number;

  @Column({ type: 'jsonb', default: '[]' })
  perks: string[];

  @Column({
    type: 'enum',
    enum: MembershipPlanStatus,
    default: MembershipPlanStatus.Draft,
  })
  status: MembershipPlanStatus;

  // İyzico subscription pricing plan reference — set once when provisioned at gateway
  @Column({ type: 'varchar', nullable: true })
  gateway_plan_reference: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => CreatorProfile, 'membership_plans')
  @JoinColumn({ name: 'creator_profile_id' })
  creator_profile: CreatorProfile;

  // Cross-domain inverse relation (string ref — MembershipSubscription defined in billing domain)
  @OneToMany('MembershipSubscription', 'membership_plan')
  subscriptions: unknown[];
}
