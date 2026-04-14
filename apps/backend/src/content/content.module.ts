import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostAttachment } from './entities/post-attachment.entity';
import { Product } from './entities/product.entity';
import { Collection } from './entities/collection.entity';
import { CollectionItem } from './entities/collection-item.entity';
import { PostChecklistProgress } from './entities/post-checklist-progress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostAttachment,
      Product,
      Collection,
      CollectionItem,
      PostChecklistProgress,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ContentModule {}
