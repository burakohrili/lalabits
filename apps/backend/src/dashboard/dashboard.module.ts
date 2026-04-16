import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { MembershipPlan } from '../creator/entities/membership-plan.entity';
import { MembershipSubscription } from '../billing/entities/membership-subscription.entity';
import { Post } from '../content/entities/post.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { CollectionItem } from '../content/entities/collection-item.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { PostAttachment } from '../content/entities/post-attachment.entity';
import { CreatorApprovedGuard } from '../creator/guards/creator-approved.guard';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreatorProfile, MembershipPlan, MembershipSubscription, Post, PostAttachment, Product, Collection, CollectionItem, Invoice]),
  ],
  providers: [DashboardService, CreatorApprovedGuard],
  controllers: [DashboardController],
})
export class DashboardModule {}
