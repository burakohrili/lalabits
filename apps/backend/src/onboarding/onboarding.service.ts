import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
  ConflictException,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { MembershipPlan, MembershipPlanStatus } from '../creator/entities/membership-plan.entity';
import { CreatorApplication, CreatorApplicationDecision } from '../creator/entities/creator-application.entity';
import { ConsentRecord, ConsentMethod } from '../legal/entities/consent-record.entity';
import { LegalDocumentVersion, LegalDocumentType } from '../legal/entities/legal-document-version.entity';
import { StorageService } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { SubmitApplicationDto } from './dto/submit-application.dto';
import { encryptIban } from '../common/iban-crypto.util';

const AVATAR_STORAGE_PREFIX = 'avatars';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(MembershipPlan)
    private readonly membershipPlanRepository: Repository<MembershipPlan>,
    @InjectRepository(CreatorApplication)
    private readonly creatorApplicationRepository: Repository<CreatorApplication>,
    @InjectRepository(ConsentRecord)
    private readonly consentRecordRepository: Repository<ConsentRecord>,
    @InjectRepository(LegalDocumentVersion)
    private readonly legalDocumentVersionRepository: Repository<LegalDocumentVersion>,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async getStatus(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new ForbiddenException('NO_CREATOR_PROFILE');
    }

    const plans = await this.membershipPlanRepository.find({
      where: { creator_profile_id: profile.id, status: MembershipPlanStatus.Draft },
      order: { tier_rank: 'ASC' },
    });

    const latestApplication = await this.creatorApplicationRepository.findOne({
      where: { creator_profile_id: profile.id },
      order: { submitted_at: 'DESC' },
    });

    const avatarSignedUrl = profile.avatar_url
      ? await this.storageService.getSignedGetUrl(profile.avatar_url)
      : null;

    // payout: surface masked summary only — iban_encrypted never leaves the service
    const payout =
      profile.payout_iban_last_four != null
        ? {
            iban_last_four: profile.payout_iban_last_four,
            iban_format_valid: profile.payout_iban_format_valid,
          }
        : null;

    // application: status mirrors profile.status (pending_review / rejected)
    // latestApplication.decision is the admin review outcome — internal only
    const application = latestApplication
      ? {
          status: profile.status,
          submitted_at: latestApplication.submitted_at,
          resubmission_count: latestApplication.resubmission_count,
        }
      : null;

    return {
      onboarding_last_step: profile.onboarding_last_step,
      profile: {
        display_name: profile.display_name,
        username: profile.username,
        bio: profile.bio,
        avatar_url: avatarSignedUrl,
      },
      category: {
        category: profile.category,
        content_format_tags: profile.content_format_tags,
      },
      plans: plans.map((p) => this.shapePlan(p)),
      payout,
      application,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getProfileOrThrow(userId);

    // Username uniqueness check — DB unique index is the ultimate guard;
    // this service check provides a clean error before hitting the constraint.
    const usernameNormalized = dto.username.toLowerCase().trim();
    const conflicting = await this.creatorProfileRepository.findOne({
      where: { username: usernameNormalized },
    });
    if (conflicting && conflicting.id !== profile.id) {
      throw new ConflictException('USERNAME_TAKEN');
    }

    let presignedPutUrl: string | null = null;
    let avatarUrl = profile.avatar_url;

    if (dto.avatar_filename && dto.avatar_content_type) {
      const ext = dto.avatar_filename.split('.').pop() ?? 'bin';
      const key = `${AVATAR_STORAGE_PREFIX}/${profile.id}/${randomUUID()}.${ext}`;
      presignedPutUrl = await this.storageService.getPresignedPutUrl(key, dto.avatar_content_type);
      avatarUrl = key;
    }

    await this.creatorProfileRepository.update(
      { id: profile.id },
      {
        username: usernameNormalized,
        display_name: dto.display_name,
        bio: dto.bio !== undefined ? dto.bio : profile.bio,
        avatar_url: avatarUrl,
        onboarding_last_step: Math.max(profile.onboarding_last_step, 1),
      },
    );

    const avatarSignedUrl = avatarUrl
      ? await this.storageService.getSignedGetUrl(avatarUrl)
      : null;

    return {
      onboarding_last_step: Math.max(profile.onboarding_last_step, 1),
      avatar_url: avatarSignedUrl,
      presigned_put_url: presignedPutUrl,
    };
  }

  async updateCategory(userId: string, dto: UpdateCategoryDto) {
    const profile = await this.getProfileOrThrow(userId);

    await this.creatorProfileRepository.update(
      { id: profile.id },
      {
        category: dto.category,
        content_format_tags: dto.content_format_tags ?? [],
        onboarding_last_step: Math.max(profile.onboarding_last_step, 2),
      },
    );

    return { onboarding_last_step: Math.max(profile.onboarding_last_step, 2) };
  }

  async createPlan(userId: string, dto: CreatePlanDto) {
    const profile = await this.getProfileOrThrow(userId);

    // Step 2 (category) must be completed before creating plans
    if (profile.onboarding_last_step < 2) {
      throw new UnprocessableEntityException('ONBOARDING_INCOMPLETE');
    }

    const plan = this.membershipPlanRepository.create({
      creator_profile_id: profile.id,
      name: dto.name,
      description: dto.description ?? null,
      price_monthly_try: dto.price_monthly_try,
      tier_rank: dto.tier_rank,
      status: MembershipPlanStatus.Draft,
    });

    const saved = await this.membershipPlanRepository.save(plan);

    await this.creatorProfileRepository.update(
      { id: profile.id },
      { onboarding_last_step: Math.max(profile.onboarding_last_step, 3) },
    );

    return this.shapePlan(saved);
  }

  async updatePlan(userId: string, planId: string, dto: UpdatePlanDto) {
    const profile = await this.getProfileOrThrow(userId);

    const plan = await this.membershipPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('PLAN_NOT_FOUND');
    }

    if (plan.creator_profile_id !== profile.id) {
      throw new ForbiddenException('PLAN_NOT_OWNED');
    }

    await this.membershipPlanRepository.update(
      { id: plan.id },
      {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price_monthly_try !== undefined && { price_monthly_try: dto.price_monthly_try }),
        ...(dto.tier_rank !== undefined && { tier_rank: dto.tier_rank }),
      },
    );

    const updated = await this.membershipPlanRepository.findOne({ where: { id: plan.id } });
    return this.shapePlan(updated!);
  }

  async updatePayout(userId: string, dto: UpdatePayoutDto) {
    const profile = await this.getProfileOrThrow(userId);

    // IBAN format validation — service-level for consistent 422 + string message
    if (!/^TR\d{24}$/.test(dto.iban)) {
      throw new UnprocessableEntityException('INVALID_IBAN_FORMAT');
    }

    // Step 3 (at least one plan) must be completed before recording payout
    if (profile.onboarding_last_step < 3) {
      throw new UnprocessableEntityException('ONBOARDING_INCOMPLETE');
    }

    const ibanKey = this.configService.get<string>('IBAN_ENCRYPTION_KEY') ?? '';
    const encrypted = encryptIban(dto.iban, ibanKey);
    const lastFour = dto.iban.slice(-4);

    await this.creatorProfileRepository.update(
      { id: profile.id },
      {
        payout_iban_encrypted: encrypted,
        payout_iban_last_four: lastFour,
        payout_iban_format_valid: true,
        onboarding_last_step: Math.max(profile.onboarding_last_step, 4),
      },
    );

    return {
      onboarding_last_step: Math.max(profile.onboarding_last_step, 4),
      payout: {
        iban_last_four: lastFour,
        iban_format_valid: true,
      },
    };
  }

  async submitApplication(
    userId: string,
    dto: SubmitApplicationDto,
    ipAddress: string | null,
  ) {
    if (!dto.agree_creator_terms) {
      throw new UnprocessableEntityException('AGREEMENT_REQUIRED');
    }

    const profile = await this.getProfileOrThrow(userId);

    // Status guard: block re-submit while pending
    if (profile.status === CreatorProfileStatus.PendingReview) {
      throw new ConflictException('ALREADY_SUBMITTED');
    }

    // Precondition checks (all steps must be completed in sequence):
    // - display_name: step 1 evidence
    // - draftPlanCount > 0: step 3 evidence (createPlan enforces step 2 was done first)
    // - payout_iban_last_four: step 4 evidence (updatePayout enforces step 3 was done first)
    const draftPlanCount = await this.membershipPlanRepository.count({
      where: { creator_profile_id: profile.id, status: MembershipPlanStatus.Draft },
    });

    const incomplete =
      !profile.display_name ||
      draftPlanCount === 0 ||
      profile.payout_iban_last_four == null;

    if (incomplete) {
      throw new UnprocessableEntityException('ONBOARDING_INCOMPLETE');
    }

    // Resolve current creator agreement version
    const agreementVersion = await this.legalDocumentVersionRepository.findOne({
      where: {
        document_type: LegalDocumentType.CreatorAgreement,
        is_current: true,
      },
    });

    if (!agreementVersion) {
      throw new ServiceUnavailableException('NO_ACTIVE_AGREEMENT');
    }

    // Load encrypted IBAN (select: false — requires explicit addSelect)
    const profileWithIban = await this.creatorProfileRepository
      .createQueryBuilder('cp')
      .addSelect('cp.payout_iban_encrypted')
      .where('cp.id = :id', { id: profile.id })
      .getOne();

    // Count prior applications for resubmission_count
    const priorCount = await this.creatorApplicationRepository.count({
      where: { creator_profile_id: profile.id },
    });

    const now = new Date();

    // Atomic transaction: ConsentRecord + CreatorApplication + profile status
    const application = await this.dataSource.transaction(async (manager) => {
      await manager.save(
        manager.create(ConsentRecord, {
          user_id: profile.user_id,
          document_type: LegalDocumentType.CreatorAgreement,
          legal_document_version_id: agreementVersion.id,
          consented_at: now,
          consent_method: ConsentMethod.OnboardingAgreementStep,
          ip_address: ipAddress,
        }),
      );

      const saved = await manager.save(
        manager.create(CreatorApplication, {
          creator_profile_id: profile.id,
          submitted_at: now,
          decision: CreatorApplicationDecision.Pending,
          iban_encrypted: profileWithIban!.payout_iban_encrypted!,
          iban_format_valid: true,
          iban_last_four: profile.payout_iban_last_four,
          agreement_version_id: agreementVersion.id,
          agreement_accepted_at: now,
          resubmission_count: priorCount,
        }),
      );

      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.PendingReview,
      });

      return saved;
    });

    return {
      application_id: application.id,
      submitted_at: application.submitted_at,
      status: 'pending_review',
    };
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async getProfileOrThrow(userId: string): Promise<CreatorProfile> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');
    return profile;
  }

  private shapePlan(plan: MembershipPlan) {
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price_monthly_try: plan.price_monthly_try,
      tier_rank: plan.tier_rank,
      status: plan.status,
    };
  }
}
