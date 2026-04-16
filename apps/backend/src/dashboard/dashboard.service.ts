import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { MembershipPlan, MembershipPlanStatus } from '../creator/entities/membership-plan.entity';
import { MembershipSubscription, MembershipSubscriptionStatus } from '../billing/entities/membership-subscription.entity';
import {
  Post,
  PostPublishStatus,
  PostModerationStatus,
  PostAccessLevel,
} from '../content/entities/post.entity';
import {
  Product,
  ProductPublishStatus,
  ProductModerationStatus,
} from '../content/entities/product.entity';
import {
  Collection,
  CollectionAccessType,
  CollectionPublishStatus,
  CollectionModerationStatus,
} from '../content/entities/collection.entity';
import {
  CollectionItem,
  CollectionItemType,
} from '../content/entities/collection-item.entity';
import { Invoice, InvoiceStatus } from '../billing/entities/invoice.entity';
import { PostAttachment, PostAttachmentType } from '../content/entities/post-attachment.entity';
import { StorageService } from '../storage/storage.service';
import { UpdateDashboardProfileDto } from './dto/update-profile.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddAttachmentDto } from './dto/add-attachment.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddCollectionItemDto } from './dto/add-collection-item.dto';
import { ReorderCollectionItemsDto } from './dto/reorder-collection-items.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(MembershipPlan)
    private readonly planRepository: Repository<MembershipPlan>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(PostAttachment)
    private readonly postAttachmentRepository: Repository<PostAttachment>,
    private readonly storageService: StorageService,
  ) {}

  // ── Overview ──────────────────────────────────────────────────────────────

  async getOverview(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });

    // Guard has already confirmed status === approved; profile is guaranteed to exist
    const p = profile!;

    const [plans, activeMembers] = await Promise.all([
      this.planRepository.find({ where: { creator_profile_id: p.id } }),
      this.subscriptionRepository.count({
        where: {
          creator_profile_id: p.id,
          status: MembershipSubscriptionStatus.Active,
        },
      }),
    ]);

    const publishedCount = plans.filter(
      (pl) => pl.status === MembershipPlanStatus.Published,
    ).length;

    return {
      // Existing fields — preserved for backward compatibility
      status: p.status,
      display_name: p.display_name,
      onboarding_last_step: p.onboarding_last_step,
      // New fields
      plan_count: plans.length,
      published_plan_count: publishedCount,
      active_member_count: activeMembers,
      payout_iban_connected: p.payout_iban_last_four !== null,
    };
  }

  // ── Plans ─────────────────────────────────────────────────────────────────

  async listPlans(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const plans = await this.planRepository.find({
      where: { creator_profile_id: p.id },
      order: { tier_rank: 'ASC' },
    });

    return { items: plans };
  }

  async publishPlan(userId: string, planId: string) {
    const plan = await this.loadOwnPlan(userId, planId);

    if (plan.status === MembershipPlanStatus.Published) {
      throw new ConflictException('PLAN_ALREADY_PUBLISHED');
    }

    await this.planRepository.update({ id: plan.id }, {
      status: MembershipPlanStatus.Published,
    });

    return { id: plan.id, status: MembershipPlanStatus.Published };
  }

  async hidePlan(userId: string, planId: string) {
    const plan = await this.loadOwnPlan(userId, planId);

    await this.planRepository.update({ id: plan.id }, {
      status: MembershipPlanStatus.Hidden,
    });

    return { id: plan.id, status: MembershipPlanStatus.Hidden };
  }

  async archivePlan(userId: string, planId: string) {
    const plan = await this.loadOwnPlan(userId, planId);

    const activeSubscribers = await this.subscriptionRepository.count({
      where: {
        membership_plan_id: plan.id,
        status: In([
          MembershipSubscriptionStatus.Active,
          MembershipSubscriptionStatus.GracePeriod,
        ]),
      },
    });

    if (activeSubscribers > 0) {
      throw new ConflictException('PLAN_HAS_SUBSCRIBERS');
    }

    await this.planRepository.update({ id: plan.id }, {
      status: MembershipPlanStatus.Archived,
    });

    return { id: plan.id, status: MembershipPlanStatus.Archived };
  }

  // ── Posts ─────────────────────────────────────────────────────────────────

  async listPosts(
    userId: string,
    status?: PostPublishStatus,
    page = 1,
    limit = 20,
  ) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const where: Record<string, unknown> = { creator_profile_id: p.id };
    if (status) where.publish_status = status;

    const [posts, total] = await this.postRepository.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        publish_status: true,
        moderation_status: true,
        access_level: true,
        created_at: true,
        published_at: true,
      },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: posts, total, page, limit };
  }

  async getPost(userId: string, postId: string) {
    const [post, attachments] = await Promise.all([
      this.loadOwnPost(userId, postId),
      this.postAttachmentRepository.find({
        where: { post_id: postId },
        order: { sort_order: 'ASC' },
      }),
    ]);
    return {
      ...post,
      attachments: attachments.map((a) => ({
        id: a.id,
        original_filename: a.original_filename,
        file_size_bytes: a.file_size_bytes,
        content_type: a.content_type,
        is_downloadable: a.is_downloadable,
        attachment_type: a.attachment_type,
        sort_order: a.sort_order,
        created_at: a.created_at,
      })),
    };
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    // LD-3: enforce required_tier_id data rule
    await this.validatePostTierRule(
      dto.access_level as PostAccessLevel,
      dto.required_tier_id ?? null,
      p.id,
    );

    const post = this.postRepository.create({
      creator_profile_id: p.id,
      title: dto.title,
      content: dto.content ?? null,
      access_level: dto.access_level as PostAccessLevel,
      required_tier_id: dto.required_tier_id ?? null,
      publish_status: PostPublishStatus.Draft,
      moderation_status: PostModerationStatus.Clean,
    });

    const saved = await this.postRepository.save(post);

    return this.postRepository.findOne({ where: { id: saved.id } });
  }

  async updatePost(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.loadOwnPost(userId, postId);

    if (post.publish_status === PostPublishStatus.Archived) {
      throw new UnprocessableEntityException('POST_ARCHIVED');
    }

    // LD-3: validate tier rule using effective values after update
    const effectiveAccessLevel = (dto.access_level as PostAccessLevel | undefined) ?? post.access_level;
    const effectiveTierId =
      dto.required_tier_id !== undefined ? (dto.required_tier_id ?? null) : post.required_tier_id;

    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    await this.validatePostTierRule(effectiveAccessLevel, effectiveTierId, profile!.id);

    const updates: {
      title?: string;
      content?: object | null;
      access_level?: PostAccessLevel;
      required_tier_id?: string | null;
    } = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.content !== undefined) updates.content = dto.content as object | null;
    if (dto.access_level !== undefined) updates.access_level = dto.access_level as PostAccessLevel;
    if (dto.required_tier_id !== undefined) updates.required_tier_id = dto.required_tier_id ?? null;

    if (Object.keys(updates).length === 0) {
      return this.postRepository.findOne({ where: { id: post.id } });
    }

    await this.postRepository.update({ id: post.id }, updates);
    return this.postRepository.findOne({ where: { id: post.id } });
  }

  async publishPost(userId: string, postId: string) {
    const post = await this.loadOwnPost(userId, postId);

    if (post.moderation_status === PostModerationStatus.Removed) {
      throw new ConflictException('POST_MODERATION_REMOVED');
    }

    if (post.publish_status === PostPublishStatus.Published) {
      throw new ConflictException('POST_ALREADY_PUBLISHED');
    }

    if (post.publish_status === PostPublishStatus.Archived) {
      throw new UnprocessableEntityException('POST_ARCHIVED');
    }

    await this.postRepository.update(
      { id: post.id },
      { publish_status: PostPublishStatus.Published, published_at: new Date() },
    );

    return { id: post.id, publish_status: PostPublishStatus.Published };
  }

  async unpublishPost(userId: string, postId: string) {
    const post = await this.loadOwnPost(userId, postId);

    if (post.publish_status !== PostPublishStatus.Published) {
      throw new UnprocessableEntityException('POST_NOT_PUBLISHED');
    }

    await this.postRepository.update(
      { id: post.id },
      { publish_status: PostPublishStatus.Draft, published_at: null },
    );

    return { id: post.id, publish_status: PostPublishStatus.Draft };
  }

  async archivePost(userId: string, postId: string) {
    const post = await this.loadOwnPost(userId, postId);

    if (post.publish_status === PostPublishStatus.Archived) {
      throw new ConflictException('POST_ALREADY_ARCHIVED');
    }

    await this.postRepository.update(
      { id: post.id },
      { publish_status: PostPublishStatus.Archived },
    );

    return { id: post.id, publish_status: PostPublishStatus.Archived };
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.loadOwnPost(userId, postId);

    if (post.publish_status !== PostPublishStatus.Draft) {
      throw new BadRequestException('POST_NOT_DELETABLE');
    }

    await this.postRepository.delete({ id: post.id });
  }

  // ── Post Attachments ──────────────────────────────────────────────────────

  async getPostAttachmentUploadUrl(
    userId: string,
    postId: string,
    contentType: string,
    originalFilename: string,
  ) {
    await this.loadOwnPost(userId, postId);
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    const storageKey = `posts/${profile!.id}/${postId}/${randomUUID()}/${originalFilename}`;
    const uploadUrl = await this.storageService.getPresignedPutUrl(storageKey, contentType);
    return { upload_url: uploadUrl, storage_key: storageKey };
  }

  async addPostAttachment(userId: string, postId: string, dto: AddAttachmentDto) {
    await this.loadOwnPost(userId, postId);
    const count = await this.postAttachmentRepository.count({ where: { post_id: postId } });
    const attachment = this.postAttachmentRepository.create({
      post_id: postId,
      storage_key: dto.storage_key,
      original_filename: dto.original_filename,
      file_size_bytes: String(dto.file_size_bytes),
      content_type: dto.content_type,
      is_downloadable: dto.is_downloadable ?? true,
      attachment_type: PostAttachmentType.File,
      sort_order: count,
    });
    const saved = await this.postAttachmentRepository.save(attachment);
    return {
      id: saved.id,
      post_id: saved.post_id,
      original_filename: saved.original_filename,
      file_size_bytes: saved.file_size_bytes,
      content_type: saved.content_type,
      is_downloadable: saved.is_downloadable,
      attachment_type: saved.attachment_type,
      sort_order: saved.sort_order,
      created_at: saved.created_at,
    };
  }

  async removePostAttachment(userId: string, postId: string, attachmentId: string) {
    await this.loadOwnPost(userId, postId);
    const att = await this.postAttachmentRepository.findOne({
      where: { id: attachmentId, post_id: postId },
    });
    if (!att) throw new NotFoundException('ATTACHMENT_NOT_FOUND');
    await this.postAttachmentRepository.delete({ id: attachmentId });
    return { success: true };
  }

  // ── Products ──────────────────────────────────────────────────────────────

  async getProductUploadUrl(userId: string, contentType: string, originalFilename: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const { randomUUID } = await import('crypto');
    const storageKey = `products/${p.id}/${randomUUID()}/${originalFilename}`;
    const uploadUrl = await this.storageService.getPresignedPutUrl(storageKey, contentType);

    return { upload_url: uploadUrl, storage_key: storageKey };
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const product = this.productRepository.create({
      creator_profile_id: p.id,
      title: dto.title,
      description: dto.description,
      price_try: dto.price_try,
      file_storage_key: dto.storage_key,
      original_filename: dto.original_filename,
      file_size_bytes: String(dto.file_size_bytes),
      content_type: dto.content_type,
      publish_status: ProductPublishStatus.Draft,
      moderation_status: ProductModerationStatus.Clean,
    });

    const saved = await this.productRepository.save(product);
    return this.safeProduct(saved);
  }

  async listProducts(
    userId: string,
    status?: ProductPublishStatus,
    page = 1,
    limit = 20,
  ) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const where: Record<string, unknown> = { creator_profile_id: p.id };
    if (status) where.publish_status = status;

    const [products, total] = await this.productRepository.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price_try: true,
        currency: true,
        publish_status: true,
        moderation_status: true,
        original_filename: true,
        file_size_bytes: true,
        content_type: true,
        created_at: true,
        updated_at: true,
      },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: products, total, page, limit };
  }

  async getProduct(userId: string, productId: string) {
    const product = await this.loadOwnProduct(userId, productId);
    return this.safeProduct(product);
  }

  async updateProduct(userId: string, productId: string, dto: UpdateProductDto) {
    const product = await this.loadOwnProduct(userId, productId);

    if (product.publish_status === ProductPublishStatus.Archived) {
      throw new UnprocessableEntityException('PRODUCT_ARCHIVED');
    }

    const updates: {
      title?: string;
      description?: string;
      price_try?: number;
    } = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.price_try !== undefined) updates.price_try = dto.price_try;

    if (Object.keys(updates).length > 0) {
      await this.productRepository.update({ id: product.id }, updates);
    }

    const updated = await this.productRepository.findOne({ where: { id: product.id } });
    return this.safeProduct(updated!);
  }

  async publishProduct(userId: string, productId: string) {
    const product = await this.loadOwnProduct(userId, productId);

    if (product.moderation_status === ProductModerationStatus.Removed) {
      throw new ConflictException('PRODUCT_MODERATION_REMOVED');
    }

    if (product.publish_status === ProductPublishStatus.Published) {
      throw new ConflictException('PRODUCT_ALREADY_PUBLISHED');
    }

    if (product.publish_status === ProductPublishStatus.Archived) {
      throw new UnprocessableEntityException('PRODUCT_ARCHIVED');
    }

    await this.productRepository.update(
      { id: product.id },
      { publish_status: ProductPublishStatus.Published },
    );

    return { id: product.id, publish_status: ProductPublishStatus.Published };
  }

  async archiveProduct(userId: string, productId: string) {
    const product = await this.loadOwnProduct(userId, productId);

    if (product.publish_status === ProductPublishStatus.Archived) {
      throw new ConflictException('PRODUCT_ALREADY_ARCHIVED');
    }

    await this.productRepository.update(
      { id: product.id },
      { publish_status: ProductPublishStatus.Archived },
    );

    return { id: product.id, publish_status: ProductPublishStatus.Archived };
  }

  async deleteProduct(userId: string, productId: string) {
    const product = await this.loadOwnProduct(userId, productId);

    if (product.publish_status !== ProductPublishStatus.Draft) {
      throw new BadRequestException('PRODUCT_NOT_DELETABLE');
    }

    await this.productRepository.delete({ id: product.id });
  }

  // ── Collections ───────────────────────────────────────────────────────────

  async listCollections(userId: string, status?: CollectionPublishStatus, page = 1, limit = 20) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    const p = profile!;

    const where: Record<string, unknown> = { creator_profile_id: p.id };
    if (status) where.publish_status = status;

    const [collections, total] = await this.collectionRepository.findAndCount({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        access_type: true,
        price_try: true,
        required_tier_id: true,
        publish_status: true,
        moderation_status: true,
        item_count: true,
        created_at: true,
        updated_at: true,
      },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: collections, total, page, limit };
  }

  async getCollection(userId: string, collectionId: string) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    const items = await this.collectionItemRepository.find({
      where: { collection_id: collection.id },
      order: { sort_order: 'ASC' },
    });

    return { ...collection, items };
  }

  async createCollection(userId: string, dto: CreateCollectionDto) {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    const p = profile!;

    const collection = this.collectionRepository.create({
      creator_profile_id: p.id,
      title: dto.title,
      description: dto.description,
      access_type: dto.access_type,
      price_try: dto.access_type === CollectionAccessType.Purchase ? (dto.price_try ?? null) : null,
      required_tier_id: dto.access_type === CollectionAccessType.TierGated ? (dto.required_tier_id ?? null) : null,
      publish_status: CollectionPublishStatus.Draft,
      moderation_status: CollectionModerationStatus.Clean,
      item_count: 0,
    });

    const saved = await this.collectionRepository.save(collection);
    return saved;
  }

  async updateCollection(userId: string, collectionId: string, dto: UpdateCollectionDto) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    if (collection.publish_status === CollectionPublishStatus.Archived) {
      throw new UnprocessableEntityException('COLLECTION_ARCHIVED');
    }

    const updates: {
      title?: string;
      description?: string;
      access_type?: CollectionAccessType;
      price_try?: number | null;
      required_tier_id?: string | null;
    } = {};

    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.access_type !== undefined) {
      updates.access_type = dto.access_type;
      if (dto.access_type === CollectionAccessType.Purchase) {
        updates.price_try = dto.price_try ?? null;
        updates.required_tier_id = null;
      } else {
        updates.required_tier_id = dto.required_tier_id ?? null;
        updates.price_try = null;
      }
    } else {
      if (dto.price_try !== undefined) updates.price_try = dto.price_try;
      if (dto.required_tier_id !== undefined) updates.required_tier_id = dto.required_tier_id;
    }

    if (Object.keys(updates).length > 0) {
      await this.collectionRepository.update({ id: collection.id }, updates);
    }

    return this.collectionRepository.findOne({ where: { id: collection.id } });
  }

  async publishCollection(userId: string, collectionId: string) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    if (collection.moderation_status === CollectionModerationStatus.Removed) {
      throw new ConflictException('COLLECTION_MODERATION_REMOVED');
    }

    if (collection.publish_status === CollectionPublishStatus.Published) {
      throw new ConflictException('COLLECTION_ALREADY_PUBLISHED');
    }

    if (collection.publish_status === CollectionPublishStatus.Archived) {
      throw new UnprocessableEntityException('COLLECTION_ARCHIVED');
    }

    await this.collectionRepository.update(
      { id: collection.id },
      { publish_status: CollectionPublishStatus.Published },
    );

    return { id: collection.id, publish_status: CollectionPublishStatus.Published };
  }

  async archiveCollection(userId: string, collectionId: string) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    if (collection.publish_status === CollectionPublishStatus.Archived) {
      throw new ConflictException('COLLECTION_ALREADY_ARCHIVED');
    }

    await this.collectionRepository.update(
      { id: collection.id },
      { publish_status: CollectionPublishStatus.Archived },
    );

    return { id: collection.id, publish_status: CollectionPublishStatus.Archived };
  }

  async deleteCollection(userId: string, collectionId: string) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    if (collection.publish_status !== CollectionPublishStatus.Draft) {
      throw new BadRequestException('COLLECTION_NOT_DELETABLE');
    }

    await this.collectionItemRepository.delete({ collection_id: collection.id });
    await this.collectionRepository.delete({ id: collection.id });
  }

  async addCollectionItem(userId: string, collectionId: string, dto: AddCollectionItemDto) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    if (collection.publish_status === CollectionPublishStatus.Archived) {
      throw new UnprocessableEntityException('COLLECTION_ARCHIVED');
    }

    const existing = await this.collectionItemRepository.findOne({
      where: { collection_id: collection.id, item_type: dto.item_type, item_id: dto.item_id },
    });
    if (existing) {
      throw new ConflictException('ITEM_ALREADY_IN_COLLECTION');
    }

    const maxSortResult = await this.collectionItemRepository
      .createQueryBuilder('ci')
      .select('MAX(ci.sort_order)', 'max')
      .where('ci.collection_id = :id', { id: collection.id })
      .getRawOne<{ max: number | null }>();

    const nextSort = (maxSortResult?.max ?? -1) + 1;

    const item = this.collectionItemRepository.create({
      collection_id: collection.id,
      item_type: dto.item_type as CollectionItemType,
      item_id: dto.item_id,
      sort_order: nextSort,
    });

    const saved = await this.collectionItemRepository.save(item);

    await this.collectionRepository.update(
      { id: collection.id },
      { item_count: () => 'item_count + 1' },
    );

    return saved;
  }

  async removeCollectionItem(userId: string, collectionId: string, itemId: string) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    const item = await this.collectionItemRepository.findOne({
      where: { id: itemId, collection_id: collection.id },
    });

    if (!item) {
      throw new NotFoundException('ITEM_NOT_FOUND');
    }

    await this.collectionItemRepository.delete({ id: item.id });

    await this.collectionRepository.update(
      { id: collection.id },
      { item_count: () => 'GREATEST(item_count - 1, 0)' },
    );
  }

  async reorderCollectionItems(userId: string, collectionId: string, dto: ReorderCollectionItemsDto) {
    const collection = await this.loadOwnCollection(userId, collectionId);

    const items = await this.collectionItemRepository.find({
      where: { collection_id: collection.id },
    });

    const itemMap = new Map(items.map((i) => [i.id, i]));

    for (const id of dto.item_ids) {
      if (!itemMap.has(id)) {
        throw new BadRequestException('ITEM_NOT_IN_COLLECTION');
      }
    }

    await Promise.all(
      dto.item_ids.map((id, index) =>
        this.collectionItemRepository.update({ id }, { sort_order: index }),
      ),
    );

    return this.collectionItemRepository.find({
      where: { collection_id: collection.id },
      order: { sort_order: 'ASC' },
    });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async loadOwnPlan(userId: string, planId: string): Promise<MembershipPlan> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const plan = await this.planRepository.findOne({ where: { id: planId } });

    if (!plan) {
      throw new NotFoundException('PLAN_NOT_FOUND');
    }

    if (plan.creator_profile_id !== p.id) {
      throw new ForbiddenException('PLAN_NOT_OWNED');
    }

    return plan;
  }

  // LD-3: tier_gated → required_tier_id mandatory + must belong to creator
  //        public / member_only → required_tier_id must be null
  private async validatePostTierRule(
    accessLevel: PostAccessLevel,
    requiredTierId: string | null,
    creatorProfileId: string,
  ): Promise<void> {
    if (accessLevel === PostAccessLevel.TierGated) {
      if (!requiredTierId) {
        throw new UnprocessableEntityException('REQUIRED_TIER_ID_MISSING');
      }
      const plan = await this.planRepository.findOne({
        where: { id: requiredTierId, creator_profile_id: creatorProfileId },
      });
      if (!plan) {
        throw new UnprocessableEntityException('INVALID_REQUIRED_TIER_ID');
      }
    } else {
      if (requiredTierId) {
        throw new UnprocessableEntityException('REQUIRED_TIER_ID_MUST_BE_NULL');
      }
    }
  }

  private async loadOwnPost(userId: string, postId: string): Promise<Post> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    if (post.creator_profile_id !== p.id) {
      throw new ForbiddenException('POST_NOT_OWNED');
    }

    return post;
  }

  private async loadOwnProduct(userId: string, productId: string): Promise<Product> {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    // addSelect to load storage-key-adjacent fields needed for ownership check
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    if (product.creator_profile_id !== p.id) {
      throw new ForbiddenException('PRODUCT_NOT_OWNED');
    }

    return product;
  }

  private async loadOwnCollection(userId: string, collectionId: string): Promise<Collection> {
    const profile = await this.creatorProfileRepository.findOne({ where: { user_id: userId } });
    const p = profile!;

    const collection = await this.collectionRepository.findOne({ where: { id: collectionId } });

    if (!collection) {
      throw new NotFoundException('COLLECTION_NOT_FOUND');
    }

    if (collection.creator_profile_id !== p.id) {
      throw new ForbiddenException('COLLECTION_NOT_OWNED');
    }

    return collection;
  }

  // Strips storage keys — never expose file_storage_key or preview_file_storage_key
  private safeProduct(product: Product) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      creator_profile,
      ...rest
    } = product as Product & { creator_profile?: unknown };

    return {
      id: rest.id,
      creator_profile_id: rest.creator_profile_id,
      title: rest.title,
      description: rest.description,
      price_try: rest.price_try,
      currency: rest.currency,
      publish_status: rest.publish_status,
      moderation_status: rest.moderation_status,
      original_filename: rest.original_filename,
      file_size_bytes: rest.file_size_bytes,
      content_type: rest.content_type,
      created_at: rest.created_at,
      updated_at: rest.updated_at,
    };
  }

  // ── Social Links ──────────────────────────────────────────────────────────

  async getSocialLinks(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
      select: { id: true, social_links: true },
    });

    return { social_links: profile?.social_links ?? null };
  }

  async updateSocialLinks(
    userId: string,
    dto: {
      youtube?: string;
      instagram?: string;
      twitter?: string;
      discord?: string;
      tiktok?: string;
      website?: string;
    },
  ) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });

    const p = profile!;

    const links = {
      youtube: dto.youtube?.trim() || null,
      instagram: dto.instagram?.trim() || null,
      twitter: dto.twitter?.trim() || null,
      discord: dto.discord?.trim() || null,
      tiktok: dto.tiktok?.trim() || null,
      website: dto.website?.trim() || null,
    };

    const hasAny = Object.values(links).some((v) => v !== null);

    await this.creatorProfileRepository.update(
      { id: p.id },
      { social_links: hasAny ? links : null },
    );

    return { social_links: hasAny ? links : null };
  }

  // ── Creator Profile Edit ───────────────────────────────────────────────────

  async updateCreatorProfile(userId: string, dto: UpdateDashboardProfileDto) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    if (!profile) throw new NotFoundException('CREATOR_PROFILE_NOT_FOUND');

    const updates: Partial<CreatorProfile> = {};
    if (dto.display_name !== undefined) updates.display_name = dto.display_name.trim();
    if (dto.bio !== undefined) updates.bio = dto.bio;

    let avatarUploadUrl: string | undefined;
    if (dto.avatar_filename && dto.avatar_content_type) {
      const ext = dto.avatar_filename.split('.').pop() ?? 'bin';
      const key = `avatars/creators/${profile.id}/${randomUUID()}.${ext}`;
      avatarUploadUrl = await this.storageService.getPresignedPutUrl(key, dto.avatar_content_type);
      updates.avatar_url = key;
    }

    let coverUploadUrl: string | undefined;
    if (dto.cover_image_filename && dto.cover_image_content_type) {
      const ext = dto.cover_image_filename.split('.').pop() ?? 'bin';
      const key = `covers/${profile.id}/${randomUUID()}.${ext}`;
      coverUploadUrl = await this.storageService.getPresignedPutUrl(key, dto.cover_image_content_type);
      updates.cover_image_url = key;
    }

    if (Object.keys(updates).length > 0) {
      await this.creatorProfileRepository.update({ id: profile.id }, updates as object);
    }

    const avatarUrl = (updates.avatar_url ?? profile.avatar_url)
      ? await this.storageService.getSignedGetUrl((updates.avatar_url ?? profile.avatar_url)!)
      : null;

    const coverUrl = (updates.cover_image_url ?? profile.cover_image_url)
      ? await this.storageService.getSignedGetUrl((updates.cover_image_url ?? profile.cover_image_url)!)
      : null;

    return {
      display_name: updates.display_name ?? profile.display_name,
      bio: updates.bio !== undefined ? updates.bio : profile.bio,
      avatar_url: avatarUrl,
      cover_image_url: coverUrl,
      ...(avatarUploadUrl ? { avatar_upload_url: avatarUploadUrl } : {}),
      ...(coverUploadUrl ? { cover_image_upload_url: coverUploadUrl } : {}),
    };
  }

  // ── Analytics ─────────────────────────────────────────────────────────────

  async getAnalytics(userId: string) {
    const profile = await this.creatorProfileRepository.findOne({
      where: { user_id: userId },
    });
    const p = profile!;

    const [
      activeMembers,
      totalContentCount,
      totalRevenueRow,
      revenueByMonthRows,
      membersByMonthRows,
      recentPosts,
    ] = await Promise.all([
      this.subscriptionRepository.count({
        where: { creator_profile_id: p.id, status: MembershipSubscriptionStatus.Active },
      }),
      this.postRepository.count({
        where: {
          creator_profile_id: p.id,
          publish_status: PostPublishStatus.Published,
          moderation_status: PostModerationStatus.Clean,
        },
      }),
      this.invoiceRepository
        .createQueryBuilder('inv')
        .select('COALESCE(SUM(inv.amount_try), 0)', 'total')
        .innerJoin('inv.membership_subscription', 'sub')
        .where('sub.creator_profile_id = :profileId', { profileId: p.id })
        .andWhere('inv.status = :status', { status: InvoiceStatus.Paid })
        .getRawOne<{ total: string }>(),
      this.invoiceRepository
        .createQueryBuilder('inv')
        .select("TO_CHAR(DATE_TRUNC('month', inv.paid_at), 'YYYY-MM')", 'month')
        .addSelect('SUM(inv.amount_try)', 'revenue_try')
        .innerJoin('inv.membership_subscription', 'sub')
        .where('sub.creator_profile_id = :profileId', { profileId: p.id })
        .andWhere('inv.status = :status', { status: InvoiceStatus.Paid })
        .andWhere("inv.paid_at >= NOW() - INTERVAL '6 months'")
        .groupBy("DATE_TRUNC('month', inv.paid_at)")
        .orderBy("DATE_TRUNC('month', inv.paid_at)", 'ASC')
        .getRawMany<{ month: string; revenue_try: string }>(),
      this.subscriptionRepository
        .createQueryBuilder('sub')
        .select("TO_CHAR(DATE_TRUNC('month', sub.created_at), 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'count')
        .where('sub.creator_profile_id = :profileId', { profileId: p.id })
        .andWhere("sub.created_at >= NOW() - INTERVAL '6 months'")
        .groupBy("DATE_TRUNC('month', sub.created_at)")
        .orderBy("DATE_TRUNC('month', sub.created_at)", 'ASC')
        .getRawMany<{ month: string; count: string }>(),
      this.postRepository.find({
        where: {
          creator_profile_id: p.id,
          publish_status: PostPublishStatus.Published,
          moderation_status: PostModerationStatus.Clean,
        },
        order: { published_at: 'DESC' },
        take: 10,
        select: ['id', 'title', 'access_level', 'published_at'],
      }),
    ]);

    return {
      summary: {
        total_revenue_try: Number(totalRevenueRow?.total ?? 0),
        active_members: activeMembers,
        total_content_count: totalContentCount,
      },
      revenue_by_month: revenueByMonthRows.map((r) => ({
        month: r.month,
        revenue_try: Number(r.revenue_try),
      })),
      members_by_month: membersByMonthRows.map((r) => ({
        month: r.month,
        count: Number(r.count),
      })),
      top_posts: recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        access_level: post.access_level,
        published_at: post.published_at,
      })),
    };
  }
}
