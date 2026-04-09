import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';   // Post
import { CreatorModule } from '../creator/creator.module';   // CreatorProfile, MembershipPlan
import { BillingModule } from '../billing/billing.module';   // MembershipSubscription
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  imports: [
    ContentModule,  // Post repository
    CreatorModule,  // CreatorProfile, MembershipPlan repositories
    BillingModule,  // MembershipSubscription repository
  ],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
