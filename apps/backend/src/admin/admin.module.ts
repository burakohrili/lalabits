import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorApplication } from '../creator/entities/creator-application.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { ModerationAction } from '../moderation/entities/moderation-action.entity';
import { Report } from '../moderation/entities/report.entity';
import { Post } from '../content/entities/post.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { User } from '../auth/entities/user.entity';
import { LegalDocumentVersion } from '../legal/entities/legal-document-version.entity';
import { MembershipPlan } from '../creator/entities/membership-plan.entity';
import { MembershipSubscription } from '../billing/entities/membership-subscription.entity';
import { NotificationModule } from '../notification/notification.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorApplication,
      CreatorProfile,
      ModerationAction,
      Report,
      Post,
      Product,
      Collection,
      User,
      LegalDocumentVersion,
      MembershipPlan,
      MembershipSubscription,
    ]),
    NotificationModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
