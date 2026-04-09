import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ProductPurchase } from '../billing/entities/product-purchase.entity';
import { CollectionPurchase } from '../billing/entities/collection-purchase.entity';
import { Product, ProductModerationStatus } from '../content/entities/product.entity';
import { Collection, CollectionAccessType, CollectionModerationStatus } from '../content/entities/collection.entity';
import { CollectionItem, CollectionItemType } from '../content/entities/collection-item.entity';
import { MembershipPlan } from '../creator/entities/membership-plan.entity';
import { CreatorProfile } from '../creator/entities/creator-profile.entity';
import { StorageService } from '../storage/storage.service';
import { MembershipService } from '../membership/membership.service';

const DEFAULT_DOWNLOAD_TTL = 300; // LD-3: 5 minutes

@Injectable()
export class LibraryService {
  private readonly downloadTtl: number;

  constructor(
    @InjectRepository(ProductPurchase)
    private readonly productPurchaseRepository: Repository<ProductPurchase>,
    @InjectRepository(CollectionPurchase)
    private readonly collectionPurchaseRepository: Repository<CollectionPurchase>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionItem)
    private readonly collectionItemRepository: Repository<CollectionItem>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    @InjectRepository(MembershipPlan)
    private readonly membershipPlanRepository: Repository<MembershipPlan>,
    private readonly storageService: StorageService,
    private readonly config: ConfigService,
    private readonly membershipService: MembershipService,
  ) {
    this.downloadTtl = this.config.get<number>(
      'LIBRARY_DOWNLOAD_URL_TTL_SECONDS',
      DEFAULT_DOWNLOAD_TTL,
    );
  }

  // ── LIST — PRODUCTS ──────────────────────────────────────────────────────

  async listPurchasedProducts(userId: string) {
    const purchases = await this.productPurchaseRepository.find({
      where: { fan_user_id: userId, access_revoked_at: IsNull() },
      order: { purchased_at: 'DESC' },
    });

    if (purchases.length === 0) {
      return { items: [] };
    }

    const productIds = purchases.map((p) => p.product_id);

    // Load products with creator info; excludes file_storage_key (select: false)
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.creator_profile', 'creator')
      .where('product.id IN (:...ids)', { ids: productIds })
      .getMany();

    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = purchases
      .map((purchase) => {
        const product = productMap.get(purchase.product_id);
        if (!product) return null;
        return {
          purchase_id: purchase.id,
          product_id: product.id,
          title: product.title,
          description: product.description,
          original_filename: product.original_filename,
          content_type: product.content_type,
          file_size_bytes: product.file_size_bytes,
          amount_paid_try: purchase.amount_paid_try,
          purchased_at: purchase.purchased_at,
          seller: product.creator_profile
            ? {
                display_name: product.creator_profile.display_name,
                username: product.creator_profile.username,
              }
            : null,
        };
      })
      .filter(Boolean);

    return { items };
  }

  // ── DOWNLOAD — PRODUCT ───────────────────────────────────────────────────

  async getProductDownloadUrl(userId: string, productId: string) {
    const purchase = await this.productPurchaseRepository.findOne({
      where: { fan_user_id: userId, product_id: productId },
    });

    if (!purchase) {
      throw new NotFoundException('NO_PURCHASE');
    }

    if (purchase.access_revoked_at !== null) {
      throw new ForbiddenException('ACCESS_REVOKED');
    }

    // Load product with file_storage_key explicitly selected
    const product = await this.productRepository
      .createQueryBuilder('product')
      .addSelect('product.file_storage_key')
      .where('product.id = :id', { id: productId })
      .getOne();

    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    // LD-4 (Wave 09): removed content is inaccessible even to purchasers
    if (product.moderation_status === ProductModerationStatus.Removed) {
      throw new ForbiddenException('CONTENT_REMOVED');
    }

    const url = await this.storageService.getSignedGetUrl(
      product.file_storage_key,
      this.downloadTtl,
    );

    const expiresAt = new Date(Date.now() + this.downloadTtl * 1000);

    // TODO: analytics event — file_accessed { type: 'product', product_id, user_id }
    return { download_url: url, expires_at: expiresAt };
  }

  // ── LIST — COLLECTIONS ───────────────────────────────────────────────────

  async listPurchasedCollections(userId: string) {
    const purchases = await this.collectionPurchaseRepository.find({
      where: { fan_user_id: userId, access_revoked_at: IsNull() },
      order: { purchased_at: 'DESC' },
    });

    if (purchases.length === 0) {
      return { items: [] };
    }

    const collectionIds = purchases.map((p) => p.collection_id);

    const collections = await this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.creator_profile', 'creator')
      .where('collection.id IN (:...ids)', { ids: collectionIds })
      .getMany();

    const collectionMap = new Map(collections.map((c) => [c.id, c]));

    const items = purchases
      .map((purchase) => {
        const collection = collectionMap.get(purchase.collection_id);
        if (!collection) return null;
        return {
          purchase_id: purchase.id,
          collection_id: collection.id,
          title: collection.title,
          description: collection.description,
          item_count: collection.item_count,
          amount_paid_try: purchase.amount_paid_try,
          purchased_at: purchase.purchased_at,
          seller: collection.creator_profile
            ? {
                display_name: collection.creator_profile.display_name,
                username: collection.creator_profile.username,
              }
            : null,
        };
      })
      .filter(Boolean);

    return { items };
  }

  // ── COLLECTION DETAIL ────────────────────────────────────────────────────

  async getCollectionDetail(userId: string, collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('COLLECTION_NOT_FOUND');
    }

    if (collection.access_type === CollectionAccessType.Purchase) {
      // purchase path — canonical entitlement: collection_purchases (Wave 05 LD)
      const purchase = await this.collectionPurchaseRepository.findOne({
        where: { fan_user_id: userId, collection_id: collectionId },
      });
      if (!purchase) throw new NotFoundException('NO_PURCHASE');
      if (purchase.access_revoked_at !== null) throw new ForbiddenException('ACCESS_REVOKED');
    } else {
      // tier_gated path — LD-1: membership_subscriptions canonical entitlement
      if (!collection.required_tier_id) {
        throw new ForbiddenException('ACCESS_REVOKED');
      }
      const requiredPlan = await this.membershipPlanRepository.findOne({
        where: { id: collection.required_tier_id },
      });
      if (!requiredPlan) throw new ForbiddenException('ACCESS_REVOKED');
      const hasAccess = await this.membershipService.hasActiveTierAccess(
        userId,
        collection.creator_profile_id,
        requiredPlan.tier_rank,
      );
      if (!hasAccess) throw new ForbiddenException('NO_SUBSCRIPTION');
    }

    // LD-2: only product items; post items are silently excluded
    const collectionItems = await this.collectionItemRepository.find({
      where: { collection_id: collectionId, item_type: CollectionItemType.Product },
      order: { sort_order: 'ASC' },
    });

    const productIds = collectionItems.map((ci) => ci.item_id);
    const products =
      productIds.length > 0
        ? await this.productRepository
            .createQueryBuilder('product')
            .where('product.id IN (:...ids)', { ids: productIds })
            .getMany()
        : [];

    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = collectionItems
      .map((ci) => {
        const product = productMap.get(ci.item_id);
        if (!product) return null;
        return {
          item_id: ci.id,
          item_type: ci.item_type,
          sort_order: ci.sort_order,
          product: {
            id: product.id,
            title: product.title,
            original_filename: product.original_filename,
            content_type: product.content_type,
            file_size_bytes: product.file_size_bytes,
          },
        };
      })
      .filter(Boolean);

    return {
      collection_id: collection.id,
      title: collection.title,
      description: collection.description,
      items,
    };
  }

  // ── DOWNLOAD — COLLECTION ITEM ───────────────────────────────────────────

  async getCollectionItemDownloadUrl(
    userId: string,
    collectionId: string,
    itemId: string,
  ) {
    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });
    if (!collection) throw new NotFoundException('COLLECTION_NOT_FOUND');

    // LD-4 (Wave 09): removed collection is inaccessible even to purchasers
    if (collection.moderation_status === CollectionModerationStatus.Removed) {
      throw new ForbiddenException('CONTENT_REMOVED');
    }

    if (collection.access_type === CollectionAccessType.Purchase) {
      // purchase path — canonical entitlement: collection_purchases (Wave 05 LD)
      const purchase = await this.collectionPurchaseRepository.findOne({
        where: { fan_user_id: userId, collection_id: collectionId },
      });
      if (!purchase) throw new NotFoundException('NO_PURCHASE');
      if (purchase.access_revoked_at !== null) throw new ForbiddenException('ACCESS_REVOKED');
    } else {
      // tier_gated path — LD-1: membership_subscriptions canonical entitlement
      if (!collection.required_tier_id) throw new ForbiddenException('ACCESS_REVOKED');
      const requiredPlan = await this.membershipPlanRepository.findOne({
        where: { id: collection.required_tier_id },
      });
      if (!requiredPlan) throw new ForbiddenException('ACCESS_REVOKED');
      const hasAccess = await this.membershipService.hasActiveTierAccess(
        userId,
        collection.creator_profile_id,
        requiredPlan.tier_rank,
      );
      if (!hasAccess) throw new ForbiddenException('NO_SUBSCRIPTION');
    }

    const collectionItem = await this.collectionItemRepository.findOne({
      where: {
        id: itemId,
        collection_id: collectionId,
        item_type: CollectionItemType.Product,
      },
    });

    if (!collectionItem) {
      throw new NotFoundException('ITEM_NOT_FOUND');
    }

    const product = await this.productRepository
      .createQueryBuilder('product')
      .addSelect('product.file_storage_key')
      .where('product.id = :id', { id: collectionItem.item_id })
      .getOne();

    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    // LD-4 (Wave 09): removed product is inaccessible even via collection
    if (product.moderation_status === ProductModerationStatus.Removed) {
      throw new ForbiddenException('CONTENT_REMOVED');
    }

    const url = await this.storageService.getSignedGetUrl(
      product.file_storage_key,
      this.downloadTtl,
    );

    const expiresAt = new Date(Date.now() + this.downloadTtl * 1000);

    // TODO: analytics event — file_accessed { type: 'collection_item', collection_id, item_id, user_id }
    return { download_url: url, expires_at: expiresAt };
  }
}
