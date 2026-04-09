import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Collection } from './collection.entity';

export enum CollectionItemType {
  Post = 'post',
  Product = 'product',
}

@Entity('collection_items')
export class CollectionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  collection_id: string;

  @Column({ type: 'enum', enum: CollectionItemType })
  item_type: CollectionItemType;

  // Polymorphic reference — no FK constraint; resolved at query time via item_type
  @Column({ type: 'uuid' })
  item_id: string;

  @Column({ type: 'int' })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  // ─── Relations ────────────────────────────────────────────────────────────
  @ManyToOne(() => Collection, (c) => c.items)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;
}
