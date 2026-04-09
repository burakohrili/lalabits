import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('chat_read_cursors')
export class ChatReadCursor {
  @PrimaryColumn({ type: 'uuid' })
  conversation_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'timestamptz' })
  last_read_at: Date;
}
