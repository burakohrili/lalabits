import { Module, forwardRef } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { BillingModule } from '../billing/billing.module';
import { CreatorModule } from '../creator/creator.module';
import { StorageModule } from '../storage/storage.module';
import { IyzicoModule } from '../iyzico/iyzico.module';
import { NotificationModule } from '../notification/notification.module';
import { MilestoneModule } from '../milestone/milestone.module';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

@Module({
  imports: [
    ContentModule,   // Product, Collection repositories
    BillingModule,   // Order, ProductPurchase, CollectionPurchase, Invoice repositories
    CreatorModule,   // CreatorProfile repository (self-purchase check)
    StorageModule,   // StorageService (download links, future use)
    IyzicoModule,    // IyzicoService (real payment gateway)
    NotificationModule,
    forwardRef(() => MilestoneModule),
  ],
  providers: [CheckoutService],
  controllers: [CheckoutController],
})
export class CheckoutModule {}
