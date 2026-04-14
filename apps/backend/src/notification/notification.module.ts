import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../moderation/entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { User } from '../auth/entities/user.entity';
import { NotificationService } from './notification.service';
import { NotificationController, NotificationPreferencesController } from './notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, NotificationPreference, User])],
  providers: [NotificationService],
  controllers: [NotificationController, NotificationPreferencesController],
  exports: [NotificationService],
})
export class NotificationModule {}
