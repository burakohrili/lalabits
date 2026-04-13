import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorCategory, CreatorProfile, CreatorProfileStatus } from './entities/creator-profile.entity';
import { CreatorApplication } from './entities/creator-application.entity';
import { Product, ProductPublishStatus, ProductModerationStatus } from '../content/entities/product.entity';
import { Collection, CollectionPublishStatus, CollectionModerationStatus } from '../content/entities/collection.entity';
import { MembershipPlan, MembershipPlanStatus } from './entities/membership-plan.entity';
import { StorageService } from '../storage/storage.service';

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
    private readonly storageService: StorageService,
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
}
