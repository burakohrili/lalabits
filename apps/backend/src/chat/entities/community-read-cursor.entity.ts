import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('community_read_cursors')
export class CommunityReadCursor {
  @PrimaryColumn({ type: 'uuid' })
  creator_profile_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'timestamptz' })
  last_read_at: Date;
}
