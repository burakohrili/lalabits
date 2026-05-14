import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreatorCategory, CreatorProfile, CreatorProfileStatus } from './entities/creator-profile.entity';
import { CreatorApplication } from './entities/creator-application.entity';
import { Product, ProductPublishStatus, ProductModerationStatus } from '../content/entities/product.entity';
import { Collection, CollectionPublishStatus, CollectionModerationStatus } from '../content/entities/collection.entity';
import { MembershipPlan, MembershipPlanStatus } from './entities/membership-plan.entity';
import { CreatorEarning, EarningStatus } from '../billing/entities/creator-earning.entity';
import { CreatorPayout, PayoutStatus } from '../billing/entities/creator-payout.entity';
import { PayoutDocument, PayoutDocumentType } from '../billing/entities/payout-document.entity';
import { StorageService } from '../storage/storage.service';
import { EncryptionService } from '../common/encryption.service';
import { encryptIban } from '../common/iban-crypto.util';
import { UpdateBillingInfoDto } from './dto/update-billing-info.dto';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(CreatorApplication)
    private readonly creatorApplicationRepository: Repository<CreatorApplication>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(MembershipPlan)
    private readonly membershipPlanRepository: Repository<MembershipPlan>,
    @InjectRepository(CreatorEarning)
    private readonly earningRepository: Repository<CreatorEarning>,
    @InjectRepository(CreatorPayout)
    private readonly payoutRepository: Repository<CreatorPayout>,
    @InjectRepository(PayoutDocument)
    private readonly payoutDocumentRepository: Repository<PayoutDocument>,
    private readonly storageService: StorageService,
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
  ) {}

  async listCreators(opts: {
    q?: string;
    category?: CreatorCategory;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.min(50, Math.max(1, opts.limit ?? 20));

    const qb = this.creatorProfileRepository
      .createQueryBuilder('cp')
      .where('cp.status = :status', { status: CreatorProfileStatus.Approved })
      .select([
        'cp.id',
        'cp.username',
        'cp.display_name',
        'cp.bio',
        'cp.avatar_url',
        'cp.category',
        'cp.content_format_tags',
        'cp.approved_at',
      ])
      .orderBy('cp.approved_at', 'DESC', 'NULLS LAST')
      .skip((page - 1) * limit)
      .take(limit);

    if (opts.q) {
      qb.andWhere(
        '(cp.display_name ILIKE :q OR cp.username ILIKE :q)',
        { q: `%${opts.q}%` },
      );
    }

    if (opts.category) {
      qb.andWhere('cp.category = :category', { category: opts.category });
    }

    const [profiles, total] = await qb.getManyAndCount();

    const items = await Promise.all(
      profiles.map(async (p) => ({
        username: p.username,
        display_name: p.display_name,
        bio: p.bio,
        avatar_url: p.avatar_url
          ? await this.storageService.getSignedGetUrl(p.avatar_url)
          : null,
        category: p.category,
        content_format_tags: p.content_format_tags,
      })),
    );

    return { items, total, page, limit };
  }

  async getStatus(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('NO_CREATOR_PROFILE');
    }

    let rejectionReason: string | null = null;

    if (profile.status === CreatorProfileStatus.Rejected) {
      const latestApplication = await this.creatorApplicationRepository.findOne({
        where: { creator_profile_id: profile.id },
        order: { submitted_at: 'DESC' },
      });
      rejectionReason = latestApplication?.rejection_reason ?? null;
    }

    return {
      status: profile.status,
      rejection_reason: rejectionReason,
      onboarding_last_step: profile.onboarding_last_step,
    };
  }

  async getPublicProfile(username: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { username },
    });

    // 404 for missing username or non-approved status — reason never exposed externally
    if (!profile || profile.status !== CreatorProfileStatus.Approved) {
      throw new NotFoundException();
    }

    const [avatarUrl, products, collections, plans] = await Promise.all([
      profile.avatar_url
        ? this.storageService.getSignedGetUrl(profile.avatar_url)
        : Promise.resolve(null),
      this.productRepository.find({
        where: {
          creator_profile_id: profile.id,
          publish_status: ProductPublishStatus.Published,
          moderation_status: ProductModerationStatus.Clean,
        },
        select: {
          id: true,
          title: true,
          description: true,
          price_try: true,
          original_filename: true,
          content_type: true,
          created_at: true,
        },
        order: { created_at: 'DESC' },
      }),
      this.collectionRepository.find({
        where: {
          creator_profile_id: profile.id,
          publish_status: CollectionPublishStatus.Published,
          moderation_status: CollectionModerationStatus.Clean,
        },
        select: {
          id: true,
          title: true,
          description: true,
          access_type: true,
          price_try: true,
          item_count: true,
          created_at: true,
        },
        order: { created_at: 'DESC' },
      }),
      this.membershipPlanRepository.find({
        where: {
          creator_profile_id: profile.id,
          status: MembershipPlanStatus.Published,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price_monthly_try: true,
          tier_rank: true,
          perks: true,
        },
        order: { tier_rank: 'ASC' },
      }),
    ]);

    return {
      username: profile.username,
      display_name: profile.display_name,
      bio: profile.bio,
      category: profile.category,
      content_format_tags: profile.content_format_tags,
      avatar_url: avatarUrl,
      social_links: profile.social_links ?? null,
      products,
      collections,
      plans,
    };
  }

  async updateBillingInfo(userId: string, dto: UpdateBillingInfoDto) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');

    const update: Record<string, unknown> = {};

    if (dto.legal_full_name !== undefined) update.legal_full_name = dto.legal_full_name;
    if (dto.tax_number !== undefined) update.tax_number = dto.tax_number;
    if (dto.phone_number !== undefined) update.phone_number = dto.phone_number;
    if (dto.full_address !== undefined) update.full_address = dto.full_address;
    if (dto.city !== undefined) update.city = dto.city;
    if (dto.postal_code !== undefined) update.postal_code = dto.postal_code;
    if (dto.entity_type !== undefined) update.entity_type = dto.entity_type as 'individual' | 'sole_trader' | 'company';
    if (dto.company_name !== undefined) update.company_name = dto.company_name;

    if (dto.tc_identity_number !== undefined && dto.tc_identity_number.trim()) {
      update.tc_identity_number_encrypted = this.encryptionService.encrypt(dto.tc_identity_number);
    }

    if (dto.iban !== undefined && dto.iban.trim()) {
      const ibanKey = this.configService.get<string>('IBAN_ENCRYPTION_KEY', '');
      if (ibanKey) {
        update.payout_iban_encrypted = encryptIban(dto.iban.replace(/\s/g, '').toUpperCase(), ibanKey);
      }
    }

    const hasBillingFields = !!(
      (update.legal_full_name || profile.legal_full_name) &&
      (update.tc_identity_number_encrypted || profile.tc_identity_number_encrypted) &&
      (update.payout_iban_encrypted || profile.payout_iban_encrypted) &&
      (update.full_address || profile.full_address)
    );

    if (hasBillingFields && !profile.billing_info_completed_at) {
      update.billing_info_completed_at = new Date();
    }

    await this.creatorProfileRepository.update({ id: profile.id }, update);

    return { billing_info_completed: hasBillingFields };
  }

  // ── Creator Earnings ───────────────────────────────────────────────────────

  async listCreatorEarnings(userId: string, opts: {
    page: number;
    limit: number;
    status?: EarningStatus;
  }) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');

    const { page, limit, status } = opts;
    const where: Record<string, unknown> = { creator_profile_id: profile.id };
    if (status) where.status = status;

    const [items, total] = await this.earningRepository.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  // ── Creator Payouts ────────────────────────────────────────────────────────

  async listCreatorPayouts(userId: string, opts: { page: number; limit: number; status?: PayoutStatus }) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');

    const { page, limit, status } = opts;
    const where: Record<string, unknown> = { creator_profile_id: profile.id };
    if (status) where.status = status;

    const [items, total] = await this.payoutRepository.findAndCount({
      where,
      order: { period_year: 'DESC', period_month: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total, page, limit };
  }

  // ── Payout Documents ───────────────────────────────────────────────────────

  async listPayoutDocuments(userId: string, payoutId: string) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');

    const payout = await this.payoutRepository.findOne({
      where: { id: payoutId, creator_profile_id: profile.id },
    });
    if (!payout) throw new NotFoundException('PAYOUT_NOT_FOUND');

    const items = await this.payoutDocumentRepository.find({
      where: { payout_id: payoutId },
      order: { uploaded_at: 'DESC' },
    });

    return { items };
  }

  async uploadPayoutDocument(
    userId: string,
    payoutId: string,
    file: { buffer: Buffer; originalname: string; mimetype: string },
    documentType: string,
  ): Promise<PayoutDocument> {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    if (!profile) throw new ForbiddenException('NO_CREATOR_PROFILE');

    const payout = await this.payoutRepository.findOne({
      where: { id: payoutId, creator_profile_id: profile.id },
    });
    if (!payout) throw new NotFoundException('PAYOUT_NOT_FOUND');

    const validTypes = Object.values(PayoutDocumentType) as string[];
    const docType = validTypes.includes(documentType)
      ? (documentType as PayoutDocumentType)
      : PayoutDocumentType.Other;

    const key = `payout-documents/${profile.id}/${payoutId}/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    await this.storageService.uploadBuffer(key, file.buffer, file.mimetype);

    const doc = this.payoutDocumentRepository.create({
      payout_id: payoutId,
      creator_profile_id: profile.id,
      document_type: docType,
      file_key: key,
      verified_at: null,
      verified_by: null,
    });

    return this.payoutDocumentRepository.save(doc);
  }
}
