import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { User } from '../auth/entities/user.entity';
import { MilestoneService } from './milestone.service';

@Injectable()
export class MilestoneCron {
  private readonly logger = new Logger(MilestoneCron.name);

  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorRepo: Repository<CreatorProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly milestoneService: MilestoneService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async checkTimeMilestones(): Promise<void> {
    this.logger.log('Zaman bazlı milestone kontrolü başladı');

    try {
      const creators = await this.creatorRepo.find({
        where: { status: CreatorProfileStatus.Approved },
        select: ['id', 'user_id', 'created_at'],
      });

      for (const creator of creators) {
        await this.milestoneService
          .checkTimeMilestonesForCreator(creator.id, creator.created_at)
          .catch((err) =>
            this.logger.error(`Creator ${creator.id} zaman milestone hatası: ${err.message}`),
          );
      }

      const fans = await this.userRepo.find({
        where: { has_fan_role: true },
        select: ['id'],
      });

      for (const fan of fans) {
        await this.milestoneService
          .checkLoyaltyMilestones(fan.id)
          .catch((err) =>
            this.logger.error(`Fan ${fan.id} sadakat milestone hatası: ${err.message}`),
          );
      }

      this.logger.log('Zaman bazlı milestone kontrolü tamamlandı');
    } catch (err) {
      this.logger.error(`Cron genel hatası: ${(err as Error).message}`);
    }
  }
}
