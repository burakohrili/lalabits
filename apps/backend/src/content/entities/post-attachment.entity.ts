import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from './post.entity';

export enum PostAttachmentType {
  File = 'file',
}

@Entity('post_attachments')
export class PostAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  post_id: string;

  // SECURITY: storage_key is NEVER exposed to frontend
  @Column({ select: false })
  storage_key: string;

  @Column()
  original_filename: string;

  // bigint returns as string in TypeScript/JS
  @Column({ type: 'bigint' })
  file_size_bytes: string;

  @Column()
  content_type: string;

  @Column({ type: 'varchar', default: 'file' })
  attachment_type: PostAttachmentType;

  @Column({ default: true })
  is_downloadable: boolean;

  @Column({ type: 'int' })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => Post, (p) => p.attachments)
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
