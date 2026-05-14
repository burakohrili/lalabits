import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CreatorProfile } from '../../creator/entities/creator-profile.entity';

export enum ViolationTargetType {
  Post = 'post',
  Product = 'product',
  Collection = 'collection',
  ChatMessage = 'chat_message',
}

export enum ViolationType {
  UnderageContent = 'underage_content',
  Obscene = 'obscene',
  AtaturkLaw = 'ataturk_law',
  TerrorPropaganda = 'terror_propaganda',
  HateSpeech = 'hate_speech',
  Other = 'other',
}

export enum ViolationSeverity {
  Warning = 'warning',
  Suspension = 'suspension',
  Ban = 'ban',
}

export enum ViolationStatus {
  Open = 'open',
  Actioned = 'actioned',
  Dismissed = 'dismissed',
}

@Entity('content_policy_violations')
export class ContentPolicyViolation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ViolationTargetType })
  target_type: ViolationTargetType;

  @Column({ type: 'uuid' })
  target_id: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creator_id: string;

  @Column({ type: 'enum', enum: ViolationType })
  violation_type: ViolationType;

  @Column({ type: 'enum', enum: ViolationSeverity, default: ViolationSeverity.Warning })
  severity: ViolationSeverity;

  @Column({ type: 'enum', enum: ViolationStatus, default: ViolationStatus.Open })
  status: ViolationStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'actioned_by', type: 'uuid', nullable: true })
  actioned_by: string | null;

  @Column({ name: 'actioned_at', type: 'timestamptz', nullable: true })
  actioned_at: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => CreatorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: CreatorProfile;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'actioned_by' })
  actioned_by_user: User | null;
}
