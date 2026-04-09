import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportTargetType } from './entities/report.entity';
import { Post } from '../content/entities/post.entity';
import { Product } from '../content/entities/product.entity';
import { Collection } from '../content/entities/collection.entity';
import { User } from '../auth/entities/user.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { SubmitReportDto } from './dto/submit-report.dto';

@Injectable()
export class ModerationService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
  ) {}

  async submitReport(reporterUserId: string, dto: SubmitReportDto) {
    // LD-2: Target existence check — all target_types required
    // LD-4: Self-report block — all target_types required
    await this.validateTarget(reporterUserId, dto.target_type, dto.target_id);

    const report = this.reportRepository.create({
      reporter_user_id: reporterUserId,
      target_type: dto.target_type,
      target_id: dto.target_id,
      reason_code: dto.reason_code,
      details: dto.details ?? null,
    });

    const saved = await this.reportRepository.save(report);

    return {
      id: saved.id,
      target_type: saved.target_type,
      target_id: saved.target_id,
      reason_code: saved.reason_code,
      status: saved.status,
      created_at: saved.created_at,
    };
  }

  // ── Private: validate target existence + self-report block ────────────────

  private async validateTarget(
    reporterUserId: string,
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<void> {
    switch (targetType) {
      case ReportTargetType.Post: {
        const post = await this.postRepository.findOne({
          where: { id: targetId },
          relations: ['creator_profile'],
        });
        if (!post) throw new NotFoundException('TARGET_NOT_FOUND');
        if (post.creator_profile?.user_id === reporterUserId) {
          throw new UnprocessableEntityException('CANNOT_REPORT_OWN_CONTENT');
        }
        break;
      }

      case ReportTargetType.Product: {
        const product = await this.productRepository.findOne({
          where: { id: targetId },
          relations: ['creator_profile'],
        });
        if (!product) throw new NotFoundException('TARGET_NOT_FOUND');
        if (product.creator_profile?.user_id === reporterUserId) {
          throw new UnprocessableEntityException('CANNOT_REPORT_OWN_CONTENT');
        }
        break;
      }

      case ReportTargetType.Collection: {
        const collection = await this.collectionRepository.findOne({
          where: { id: targetId },
          relations: ['creator_profile'],
        });
        if (!collection) throw new NotFoundException('TARGET_NOT_FOUND');
        if (collection.creator_profile?.user_id === reporterUserId) {
          throw new UnprocessableEntityException('CANNOT_REPORT_OWN_CONTENT');
        }
        break;
      }

      case ReportTargetType.User: {
        const user = await this.userRepository.findOne({ where: { id: targetId } });
        if (!user) throw new NotFoundException('TARGET_NOT_FOUND');
        if (targetId === reporterUserId) {
          throw new UnprocessableEntityException('CANNOT_REPORT_OWN_CONTENT');
        }
        break;
      }

      case ReportTargetType.CreatorProfile: {
        const profile = await this.creatorProfileRepository.findOne({
          where: { id: targetId },
        });
        if (!profile) throw new NotFoundException('TARGET_NOT_FOUND');
        if (profile.user_id === reporterUserId) {
          throw new UnprocessableEntityException('CANNOT_REPORT_OWN_CONTENT');
        }
        break;
      }

      default:
        throw new NotFoundException('TARGET_NOT_FOUND');
    }
  }
}
