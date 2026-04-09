import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorProfile, CreatorProfileStatus } from '../../creator/entities/creator-profile.entity';
import { User } from '../../auth/entities/user.entity';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

const ALLOWED_STATUSES: CreatorProfileStatus[] = [
  CreatorProfileStatus.Onboarding,
  CreatorProfileStatus.Rejected,
];

/**
 * Must be applied AFTER JwtAuthGuard.
 * Allows only creators whose CreatorProfile.status is 'onboarding' or 'rejected'.
 * Also enforces email_verified_at IS NOT NULL — a creator with an unverified email
 * may hold a valid access token but must not access onboarding write endpoints.
 */
@Injectable()
export class CreatorOnboardingGuard implements CanActivate {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('NOT_AUTHENTICATED');
    }

    // Enforce email verification
    const dbUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!dbUser || !dbUser.email_verified_at) {
      throw new ForbiddenException('EMAIL_NOT_VERIFIED');
    }

    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: user.id },
    });

    if (!profile) {
      throw new ForbiddenException('NO_CREATOR_PROFILE');
    }

    if (!ALLOWED_STATUSES.includes(profile.status)) {
      throw new ForbiddenException('CREATOR_STATUS_INVALID');
    }

    return true;
  }
}
