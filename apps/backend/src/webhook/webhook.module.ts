import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { IyzicoModule } from '../iyzico/iyzico.module';
import { MembershipModule } from '../membership/membership.module';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    BillingModule,      // WebhookEvent repository
    IyzicoModule,       // IyzicoService for LD-3 gateway state confirmation
    MembershipModule,   // MembershipService for state updates
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
