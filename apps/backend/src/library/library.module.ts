import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { BillingModule } from '../billing/billing.module';
import { CreatorModule } from '../creator/creator.module';
import { MembershipModule } from '../membership/membership.module';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';

@Module({
  imports: [
    ContentModule,     // Product, Collection, CollectionItem repositories
    BillingModule,     // ProductPurchase, CollectionPurchase repositories
    CreatorModule,     // CreatorProfile, MembershipPlan repositories
    MembershipModule,  // MembershipService.hasActiveTierAccess (tier_gated access)
  ],
  providers: [LibraryService],
  controllers: [LibraryController],
})
export class LibraryModule {}
