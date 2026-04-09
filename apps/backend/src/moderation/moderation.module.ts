import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ModerationAction } from './entities/moderation-action.entity';
import { Post } from '../content/entities/post.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { User } from '../auth/entities/user.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      ModerationAction,
      Post,
      Product,
      Collection,
      User,
      CreatorProfile,
    ]),
  ],
  providers: [ModerationService],
  controllers: [ModerationController],
  exports: [TypeOrmModule],
})
export class ModerationModule {}
