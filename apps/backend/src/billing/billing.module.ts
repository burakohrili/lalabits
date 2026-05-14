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
import { SubscriptionConsent } from './entities/subscription-consent.entity';
import { FanBillingProfile } from './entities/fan-billing-profile.entity';
import { CheckoutConsent } from './entities/checkout-consent.entity';
import { CreatorEarning } from './entities/creator-earning.entity';
import { CreatorPayout } from './entities/creator-payout.entity';
import { PayoutDocument } from './entities/payout-document.entity';
import { RefundRequest } from './entities/refund-request.entity';
import { RiskEvent } from './entities/risk-event.entity';
import { CommissionService } from './services/commission.service';
import { GraceExpiryJob } from './jobs/grace-expiry.job';
import { PauseResumeJob } from './jobs/pause-resume.job';
import { RenewalReminderJob } from './jobs/renewal-reminder.job';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { User } from '../auth/entities/user.entity';
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
      User,
      PaymentDispute,
      SubscriptionConsent,
      FanBillingProfile,
      CheckoutConsent,
      CreatorEarning,
      CreatorPayout,
      PayoutDocument,
      RefundRequest,
      RiskEvent,
    ]),
  ],
  providers: [GraceExpiryJob, PauseResumeJob, RenewalReminderJob, BillingService, CommissionService],
  controllers: [BillingController],
  exports: [TypeOrmModule],
})
export class BillingModule {}
