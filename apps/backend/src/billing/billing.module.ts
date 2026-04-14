import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MembershipSubscription } from './entities/membership-subscription.entity';
import { Order } from './entities/order.entity';
import { Invoice } from './entities/invoice.entity';
import { ProductPurchase } from './entities/product-purchase.entity';
import { CollectionPurchase } from './entities/collection-purchase.entity';
import { PostPurchase } from './entities/post-purchase.entity';
import { BillingCustomer } from './entities/billing-customer.entity';
import { PaymentMethodSummary } from './entities/payment-method-summary.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { PaymentDispute } from './entities/payment-dispute.entity';
import { GraceExpiryJob } from './jobs/grace-expiry.job';
import { PauseResumeJob } from './jobs/pause-resume.job';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationModule,
    TypeOrmModule.forFeature([
      MembershipSubscription,
      Order,
      Invoice,
      ProductPurchase,
      CollectionPurchase,
      PostPurchase,
      BillingCustomer,
      PaymentMethodSummary,
      WebhookEvent,
      CreatorProfile,
      PaymentDispute,
    ]),
  ],
  providers: [GraceExpiryJob, PauseResumeJob, BillingService],
  controllers: [BillingController],
  exports: [TypeOrmModule],
})
export class BillingModule {}
