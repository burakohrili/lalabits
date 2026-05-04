import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

export enum UserAccountStatus {
  Active = 'active',
  Suspended = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password_hash: string | null;

  @Column()
  display_name: string;

  @Column({ type: 'varchar', nullable: true })
  avatar_url: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at: Date | null;

  @Column({ default: true })
  has_fan_role: boolean;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ type: 'int', nullable: true })
  fan_rank: number | null;

  @Column({
    type: 'enum',
    enum: UserAccountStatus,
    default: UserAccountStatus.Active,
  })
  account_status: UserAccountStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at: Date | null;

  // ─── Inverse relations (string refs — target entities defined in other domains) ──
  @OneToOne('CreatorProfile', 'user')
  creator_profile: unknown;

  @OneToOne('BillingCustomer', 'user')
  billing_customer: unknown;

  @OneToMany('ConsentRecord', 'user')
  consent_records: unknown[];

  @OneToMany('MembershipSubscription', 'fan_user')
  subscriptions: unknown[];

  @OneToMany('Notification', 'recipient_user')
  notifications: unknown[];
}
