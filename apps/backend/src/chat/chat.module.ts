import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BillingModule } from '../billing/billing.module';
import { CreatorModule } from '../creator/creator.module';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatReadCursor } from './entities/chat-read-cursor.entity';
import { CommunityMessage } from './entities/community-message.entity';
import { CommunityReadCursor } from './entities/community-read-cursor.entity';
import { Report } from '../moderation/entities/report.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatConversation,
      ChatMessage,
      ChatReadCursor,
      CommunityMessage,
      CommunityReadCursor,
      Report,
    ]),
    AuthModule,       // User entity + JwtAuthGuard
    BillingModule,    // MembershipSubscription entity
    CreatorModule,    // CreatorProfile entity
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
