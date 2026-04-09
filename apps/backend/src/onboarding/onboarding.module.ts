import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { MembershipPlan } from '../creator/entities/membership-plan.entity';
import { CreatorApplication } from '../creator/entities/creator-application.entity';
import { User } from '../auth/entities/user.entity';
import { ConsentRecord } from '../legal/entities/consent-record.entity';
import { LegalDocumentVersion } from '../legal/entities/legal-document-version.entity';
import { CreatorOnboardingGuard } from './guards/creator-onboarding.guard';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreatorProfile,
      MembershipPlan,
      CreatorApplication,
      User,
      ConsentRecord,
      LegalDocumentVersion,
    ]),
    // StorageModule is @Global() — no explicit import needed
  ],
  providers: [OnboardingService, CreatorOnboardingGuard],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
