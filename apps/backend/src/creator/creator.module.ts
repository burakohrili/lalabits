import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from './entities/creator-profile.entity';
import { CreatorApplication } from './entities/creator-application.entity';
import { MembershipPlan } from './entities/membership-plan.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { CreatorApprovedGuard } from './guards/creator-approved.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreatorProfile, CreatorApplication, MembershipPlan, Product, Collection]),
    // StorageModule is @Global() — no explicit import needed
  ],
  providers: [CreatorService, CreatorApprovedGuard],
  controllers: [CreatorController],
  exports: [TypeOrmModule, CreatorApprovedGuard],
})
export class CreatorModule {}
