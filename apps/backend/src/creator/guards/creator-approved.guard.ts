import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorProfile, CreatorProfileStatus } from '../entities/creator-profile.entity';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

/**
 * Must be applied AFTER JwtAuthGuard.
 * Allows only creators whose CreatorProfile.status is 'approved'.
 * Does NOT check email_verified_at — that is an onboarding concern, not a dashboard concern.
 */
@Injectable()
export class CreatorApprovedGuard implements CanActivate {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const user = request.user;

    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: user.id },
    });

    if (!profile) {
      throw new ForbiddenException('NO_CREATOR_PROFILE');
    }

    if (profile.status !== CreatorProfileStatus.Approved) {
      throw new ForbiddenException('CREATOR_NOT_APPROVED');
    }

    return true;
  }
}
