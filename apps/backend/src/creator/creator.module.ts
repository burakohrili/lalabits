import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from './entities/creator-profile.entity';
import { CreatorApplication } from './entities/creator-application.entity';
import { MembershipPlan } from './entities/membership-plan.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { CreatorEarning } from '../billing/entities/creator-earning.entity';
import { CreatorPayout } from '../billing/entities/creator-payout.entity';
import { PayoutDocument } from '../billing/entities/payout-document.entity';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { CreatorApprovedGuard } from './guards/creator-approved.guard';
import { EncryptionService } from '../common/encryption.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorProfile,
      CreatorApplication,
      MembershipPlan,
      Product,
      Collection,
      CreatorEarning,
      CreatorPayout,
      PayoutDocument,
    ]),
    // StorageModule is @Global() — no explicit import needed
  ],
  providers: [CreatorService, CreatorApprovedGuard, EncryptionService],
  controllers: [CreatorController],
  exports: [TypeOrmModule, CreatorApprovedGuard],
})
export class CreatorModule {}
