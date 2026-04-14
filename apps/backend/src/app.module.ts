import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { StorageModule } from './storage/storage.module';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CreatorModule } from './creator/creator.module';
import { ContentModule } from './content/content.module';
import { BillingModule } from './billing/billing.module';
import { LegalModule } from './legal/legal.module';
import { ModerationModule } from './moderation/moderation.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CheckoutModule } from './checkout/checkout.module';
import { LibraryModule } from './library/library.module';
import { MembershipModule } from './membership/membership.module';
import { FeedModule } from './feed/feed.module';
import { WebhookModule } from './webhook/webhook.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { BlockModule } from './moderation/block.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisModule,
    StorageModule,
    EmailModule,
    HealthModule,
    AuthModule,
    CreatorModule,
    ContentModule,
    BillingModule,
    LegalModule,
    ModerationModule,
    OnboardingModule,
    AdminModule,
    DashboardModule,
    CheckoutModule,
    LibraryModule,
    MembershipModule,
    FeedModule,
    WebhookModule,
    NotificationModule,
    ChatModule,
    BlockModule,
    BlogModule,
  ],
})
export class AppModule {}
