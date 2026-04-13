import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  Check,
} from 'typeorm';

@Entity('user_blocks')
@Unique('uq_user_blocks', ['blocker_user_id', 'blocked_user_id'])
@Check('chk_no_self_block', `"blocker_user_id" != "blocked_user_id"`)
export class UserBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  blocker_user_id: string;

  @Column({ type: 'uuid' })
  blocked_user_id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
