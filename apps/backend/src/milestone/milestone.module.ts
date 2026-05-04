import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorMilestone } from './entities/creator-milestone.entity';
import { FanMilestone } from './entities/fan-milestone.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { User } from '../auth/entities/user.entity';
import { MilestoneService } from './milestone.service';
import { MilestoneCron } from './milestone.cron';
import { MilestoneController } from './milestone.controller';
import { StorageModule } from '../storage/storage.module';
import { NotificationModule } from '../notification/notification.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreatorMilestone, FanMilestone, CreatorProfile, User]),
    StorageModule,
    NotificationModule,
    EmailModule,
  ],
  providers: [MilestoneService, MilestoneCron],
  controllers: [MilestoneController],
  exports: [MilestoneService],
})
export class MilestoneModule {}
