import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { MilestoneType } from './milestone-type.enum';

@Entity('fan_milestones')
@Index(['fan_id', 'type', 'related_creator_id'])
export class FanMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fan_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fan_id' })
  fan: User;

  @Column({ type: 'uuid', nullable: true })
  related_creator_id: string | null;

  @ManyToOne(() => CreatorProfile, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'related_creator_id' })
  related_creator: CreatorProfile | null;

  @Column({ type: 'varchar' })
  type: MilestoneType;

  @Column({ type: 'varchar', nullable: true })
  certificate_url: string | null;

  @Column({ type: 'text' })
  share_text: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  earned_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  notified_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
