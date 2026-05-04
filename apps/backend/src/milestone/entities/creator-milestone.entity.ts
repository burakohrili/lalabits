import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';
import { MilestoneType } from './milestone-type.enum';

@Entity('creator_milestones')
@Index(['creator_id', 'type'], { unique: true })
export class CreatorMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  creator_id: string;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: CreatorProfile;

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
