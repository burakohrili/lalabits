import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Post,
  PostAccessLevel,
  PostPublishStatus,
  PostModerationStatus,
} from '../content/entities/post.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { MembershipPlan, MembershipPlanStatus } from '../creator/entities/membership-plan.entity';
import { MembershipSubscription, MembershipSubscriptionStatus } from '../billing/entities/membership-subscription.entity';
import { PostChecklistProgress } from '../content/entities/post-checklist-progress.entity';

// ── Teaser excerpt ─────────────────────────────────────────────────────────

const TEASER_MAX_CHARS = 200;

function extractExcerpt(content: object | null): string | null {
  if (!content) return null;
  const c = content as { type?: string; body?: string };
  if (!c.body) return null;
  const text = c.body.slice(0, TEASER_MAX_CHARS);
  return text.length < c.body.length ? text + '…' : text;
}

// ── Access resolution helpers ─────────────────────────────────────────────

// Wave 08: grace_period = renewal failed but grace window still open → access continues
function isAccessActive(sub: MembershipSubscription): boolean {
  const now = new Date();
  if (sub.status === MembershipSubscriptionStatus.GracePeriod) {
    return sub.grace_period_ends_at != null && sub.grace_period_ends_at > now;
  }
  return (
    (sub.status === MembershipSubscriptionStatus.Active ||
      sub.status === MembershipSubscriptionStatus.Cancelled) &&
    sub.current_period_end > now
  );
}

// ── Response shapes ────────────────────────────────────────────────────────

export interface PostFeedItem {
  id: string;
  title: string;
  access_level: PostAccessLevel;
  required_tier_id: string | null;
  cta_plan_id: string | null;  // LD-1
  published_at: Date | null;
  locked: boolean;
  teaser: string | null;       // only when locked
  content: object | null;      // only when !locked
}

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(MembershipPlan)
    private readonly planRepository: Repository<MembershipPlan>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(PostChecklistProgress)
    private readonly checklistProgressRepository: Repository<PostChecklistProgress>,
  ) {}

  // ── Public feed ─────────────────────────────────────────────────────────

  async getFeed(
    username: string,
    viewerUserId: string | undefined,
    page = 1,
    limit = 20,
  ): Promise<{ items: PostFeedItem[]; total: number; page: number; limit: number }> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { username },
    });
    if (!profile || profile.status === CreatorProfileStatus.Suspended) {
      throw new NotFoundException('CREATOR_NOT_FOUND');
    }

    // LD-2: Premium posts excluded entirely
    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        creator_profile_id: profile.id,
        publish_status: PostPublishStatus.Published,
        moderation_status: PostModerationStatus.Clean,
      },
      order: { published_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Filter out Premium after DB fetch (enum exclusion via TypeORM requires Not())
    const visiblePosts = posts.filter(
      (p) => p.access_level !== PostAccessLevel.Premium,
    );

    const isOwner = viewerUserId
      ? await this.isCreatorOwner(viewerUserId, profile.id)
      : false;

    // Resolve viewer's active subscription for this creator (once for all posts)
    const activeSub = viewerUserId
      ? await this.findActiveSub(viewerUserId, profile.id)
      : null;

    // LD-1: lowest-tier published plan for member_only CTA
    const ctaLowestPlan = await this.findLowestPublishedPlan(profile.id);

    const items = await Promise.all(
      visiblePosts.map((post) =>
        this.resolvePostItem(post, isOwner, activeSub, ctaLowestPlan),
      ),
    );

    return { items, total: total - (posts.length - visiblePosts.length), page, limit };
  }

  // ── Post detail ─────────────────────────────────────────────────────────

  async getPost(
    postId: string,
    viewerUserId: string | undefined,
  ): Promise<PostFeedItem> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (
      !post ||
      post.publish_status !== PostPublishStatus.Published ||
      post.moderation_status === PostModerationStatus.Removed ||
      post.access_level === PostAccessLevel.Premium  // LD-2
    ) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    const profile = await this.creatorProfileRepository.findOne({
      where: { id: post.creator_profile_id },
    });

    if (!profile || profile.status === CreatorProfileStatus.Suspended) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    const isOwner = viewerUserId
      ? await this.isCreatorOwner(viewerUserId, post.creator_profile_id)
      : false;

    const activeSub = viewerUserId
      ? await this.findActiveSub(viewerUserId, post.creator_profile_id)
      : null;

    const ctaLowestPlan = profile
      ? await this.findLowestPublishedPlan(profile.id)
      : null;

    return this.resolvePostItem(post, isOwner, activeSub, ctaLowestPlan);
  }

  // ── Access resolution ────────────────────────────────────────────────────

  private async resolvePostItem(
    post: Post,
    isOwner: boolean,
    activeSub: MembershipSubscription | null,
    ctaLowestPlan: MembershipPlan | null,
  ): Promise<PostFeedItem> {
    const access = await this.computeAccess(post, isOwner, activeSub);

    if (access === 'full') {
      return {
        id: post.id,
        title: post.title,
        access_level: post.access_level,
        required_tier_id: post.required_tier_id,
        cta_plan_id: null,
        published_at: post.published_at,
        locked: false,
        teaser: null,
        content: post.content,
      };
    }

    // Locked — compute cta_plan_id per LD-1
    const ctaPlanId =
      post.access_level === PostAccessLevel.TierGated
        ? post.required_tier_id          // LD-1: tier_gated → use required_tier_id
        : ctaLowestPlan?.id ?? null;     // LD-1: member_only → lowest published plan

    return {
      id: post.id,
      title: post.title,
      access_level: post.access_level,
      required_tier_id: post.required_tier_id,
      cta_plan_id: ctaPlanId,
      published_at: post.published_at,
      locked: true,
      teaser: extractExcerpt(post.content),
      content: null,
    };
  }

  private async computeAccess(
    post: Post,
    isOwner: boolean,
    activeSub: MembershipSubscription | null,
  ): Promise<'full' | 'locked'> {
    if (isOwner) return 'full';
    if (post.access_level === PostAccessLevel.Public) return 'full';

    if (post.access_level === PostAccessLevel.MemberOnly) {
      return activeSub && isAccessActive(activeSub) ? 'full' : 'locked';
    }

    if (post.access_level === PostAccessLevel.TierGated) {
      if (!activeSub || !isAccessActive(activeSub)) return 'locked';
      // Load fan's plan tier_rank
      const fanPlan = await this.planRepository.findOne({
        where: { id: activeSub.membership_plan_id },
      });
      const requiredPlan = post.required_tier_id
        ? await this.planRepository.findOne({ where: { id: post.required_tier_id } })
        : null;
      if (!fanPlan || !requiredPlan) return 'locked';
      return fanPlan.tier_rank >= requiredPlan.tier_rank ? 'full' : 'locked';
    }

    return 'locked';
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private async isCreatorOwner(
    userId: string,
    creatorProfileId: string,
  ): Promise<boolean> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId, id: creatorProfileId },
    });
    return !!profile;
  }

  private async findActiveSub(
    userId: string,
    creatorProfileId: string,
  ): Promise<MembershipSubscription | null> {
    // Wave 08: include grace_period — access continues during grace window
    return this.subscriptionRepository.findOne({
      where: {
        fan_user_id: userId,
        creator_profile_id: creatorProfileId,
        status: In([
          MembershipSubscriptionStatus.Active,
          MembershipSubscriptionStatus.Cancelled,
          MembershipSubscriptionStatus.GracePeriod,
        ]),
      },
      order: { created_at: 'DESC' },
    });
  }

  // ── Home Feed (fan) ──────────────────────────────────────────────────────

  async getHomeFeed(
    fanUserId: string,
    page = 1,
    limit = 20,
  ): Promise<{ items: (PostFeedItem & { creator_username: string; creator_display_name: string; creator_avatar_url: string | null })[]; total: number; page: number; limit: number; creators_count: number }> {
    const safeLimit = Math.min(50, Math.max(1, limit));
    const safePage = Math.max(1, page);

    // Active subscriptions
    const subs = await this.subscriptionRepository.find({
      where: {
        fan_user_id: fanUserId,
        status: In([
          MembershipSubscriptionStatus.Active,
          MembershipSubscriptionStatus.Cancelled,
          MembershipSubscriptionStatus.GracePeriod,
        ]),
      },
    });

    const activeSubs = subs.filter(isAccessActive);
    if (activeSubs.length === 0) {
      return { items: [], total: 0, page: safePage, limit: safeLimit, creators_count: 0 };
    }

    const creatorProfileIds = [...new Set(activeSubs.map((s) => s.creator_profile_id))];

    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        creator_profile_id: In(creatorProfileIds),
        publish_status: PostPublishStatus.Published,
        moderation_status: PostModerationStatus.Clean,
      },
      order: { published_at: 'DESC' },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    });

    const visiblePosts = posts.filter((p) => p.access_level !== PostAccessLevel.Premium);

    const profiles = await this.creatorProfileRepository.find({
      where: { id: In(creatorProfileIds) },
    });
    const profileMap = new Map(profiles.map((p) => [p.id, p]));

    const subByCreator = new Map(activeSubs.map((s) => [s.creator_profile_id, s]));

    const items = await Promise.all(
      visiblePosts.map(async (post) => {
        const profile = profileMap.get(post.creator_profile_id);
        const sub = subByCreator.get(post.creator_profile_id) ?? null;
        const ctaPlan = await this.findLowestPublishedPlan(post.creator_profile_id);
        const base = await this.resolvePostItem(post, false, sub, ctaPlan);
        return {
          ...base,
          creator_username: profile?.username ?? '',
          creator_display_name: profile?.display_name ?? '',
          creator_avatar_url: profile?.avatar_url ?? null,
        };
      }),
    );

    return {
      items,
      total: total - (posts.length - visiblePosts.length),
      page: safePage,
      limit: safeLimit,
      creators_count: creatorProfileIds.length,
    };
  }

  private async findLowestPublishedPlan(
    creatorProfileId: string,
  ): Promise<MembershipPlan | null> {
    return this.planRepository.findOne({
      where: {
        creator_profile_id: creatorProfileId,
        status: MembershipPlanStatus.Published,
      },
      order: { tier_rank: 'ASC' },
    });
  }

  // ── Checklist Progress ───────────────────────────────────────────────────

  async getChecklistProgress(
    postId: string,
    userId: string,
  ): Promise<{ post_id: string; checked_item_ids: string[] }> {
    const progress = await this.checklistProgressRepository.findOne({
      where: { post_id: postId, user_id: userId },
    });
    return { post_id: postId, checked_item_ids: progress?.checked_item_ids ?? [] };
  }

  async updateChecklistProgress(
    postId: string,
    userId: string,
    checkedItemIds: string[],
  ): Promise<{ post_id: string; checked_item_ids: string[] }> {
    await this.checklistProgressRepository.upsert(
      { post_id: postId, user_id: userId, checked_item_ids: checkedItemIds },
      { conflictPaths: ['post_id', 'user_id'] },
    );
    return { post_id: postId, checked_item_ids: checkedItemIds };
  }
}
