import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { CreatorModule } from '../creator/creator.module';
import { IyzicoModule } from '../iyzico/iyzico.module';
import { NotificationModule } from '../notification/notification.module';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';

@Module({
  imports: [
    BillingModule,   // MembershipSubscription, Invoice repositories
    CreatorModule,   // MembershipPlan, CreatorProfile repositories
    IyzicoModule,    // IyzicoService (real subscription gateway)
    NotificationModule,
  ],
  providers: [MembershipService],
  controllers: [MembershipController],
  exports: [MembershipService],  // LibraryService + WebhookService use this
})
export class MembershipModule {}
