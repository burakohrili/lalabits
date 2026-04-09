import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, IsNull, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Product, ProductPublishStatus, ProductModerationStatus } from '../content/entities/product.entity';
import {
  Collection,
  CollectionPublishStatus,
  CollectionModerationStatus,
  CollectionAccessType,
} from '../content/entities/collection.entity';
import { Order, OrderStatus, OrderType } from '../billing/entities/order.entity';
import { ProductPurchase } from '../billing/entities/product-purchase.entity';
import { CollectionPurchase } from '../billing/entities/collection-purchase.entity';
import { Invoice, InvoiceStatus, InvoiceType } from '../billing/entities/invoice.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { StorageService } from '../storage/storage.service';
import { IyzicoService } from '../iyzico/iyzico.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../moderation/entities/notification.entity';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(ProductPurchase)
    private readonly productPurchaseRepository: Repository<ProductPurchase>,
    @InjectRepository(CollectionPurchase)
    private readonly collectionPurchaseRepository: Repository<CollectionPurchase>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepository: Repository<CreatorProfile>,
    private readonly storageService: StorageService,
    private readonly iyzicoService: IyzicoService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
  ) {}

  // ── PUBLIC STORE ENDPOINTS — move to StoreModule when extracted ──────────

  async getProductPreview(productId: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        publish_status: ProductPublishStatus.Published,
        moderation_status: ProductModerationStatus.Clean,
      },
    });

    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    const creator = await this.creatorProfileRepository.findOne({
      where: { id: product.creator_profile_id },
    });

    if (!creator || creator.status === CreatorProfileStatus.Suspended) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price_try: product.price_try,
      original_filename: product.original_filename,
      content_type: product.content_type,
      seller: { display_name: creator.display_name, username: creator.username },
    };
  }

  async getCollectionPreview(collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
        publish_status: CollectionPublishStatus.Published,
        moderation_status: CollectionModerationStatus.Clean,
      },
    });

    if (!collection) {
      throw new NotFoundException('COLLECTION_NOT_FOUND');
    }

    const creator = await this.creatorProfileRepository.findOne({
      where: { id: collection.creator_profile_id },
    });

    if (!creator || creator.status === CreatorProfileStatus.Suspended) {
      throw new NotFoundException('COLLECTION_NOT_FOUND');
    }

    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      access_type: collection.access_type,
      price_try: collection.price_try,
      item_count: collection.item_count,
      seller: creator
        ? { display_name: creator.display_name, username: creator.username }
        : null,
    };
  }

  // ── PURCHASE STATUS (auth-gated) ─────────────────────────────────────────

  async getPurchaseStatus(
    userId: string,
    productId?: string,
    collectionId?: string,
  ): Promise<{ purchased: boolean }> {
    if (productId) {
      const existing = await this.productPurchaseRepository.findOne({
        where: { fan_user_id: userId, product_id: productId, access_revoked_at: IsNull() },
      });
      return { purchased: !!existing };
    }

    if (collectionId) {
      const existing = await this.collectionPurchaseRepository.findOne({
        where: { fan_user_id: userId, collection_id: collectionId, access_revoked_at: IsNull() },
      });
      return { purchased: !!existing };
    }

    return { purchased: false };
  }

  // ── CHECKOUT RESULT POLL ─────────────────────────────────────────────────

  async getCheckoutResult(
    userId: string,
    conversationId: string,
  ): Promise<{ status: string }> {
    const order = await this.orderRepository.findOne({
      where: { gateway_conversation_id: conversationId, fan_user_id: userId },
    });

    if (!order) {
      throw new NotFoundException('ORDER_NOT_FOUND');
    }

    return { status: order.status };
  }

  // ── PURCHASE — PRODUCT ───────────────────────────────────────────────────

  async purchaseProduct(userId: string, productId: string) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        publish_status: ProductPublishStatus.Published,
        moderation_status: ProductModerationStatus.Clean,
      },
    });

    if (!product) {
      throw new NotFoundException('PRODUCT_NOT_FOUND');
    }

    // Self-purchase check
    const creatorProfile = await this.creatorProfileRepository.findOne({
      where: { id: product.creator_profile_id },
    });
    if (creatorProfile?.user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_PURCHASE_OWN');
    }

    // Duplicate check — product_purchases IS the entitlement source
    const existing = await this.productPurchaseRepository.findOne({
      where: { fan_user_id: userId, product_id: productId, access_revoked_at: IsNull() },
    });
    if (existing) {
      throw new ConflictException('ALREADY_PURCHASED');
    }

    if (!this.iyzicoService.isEnabled) {
      return this.mockPurchaseProduct(userId, productId, product.price_try);
    }

    return this.realPurchaseProduct(userId, productId, product);
  }

  private async mockPurchaseProduct(userId: string, productId: string, priceTry: number) {
    const now = new Date();
    const result = await this.dataSource.transaction(async (manager) => {
      const order = await manager.save(
        manager.create(Order, {
          fan_user_id: userId,
          order_type: OrderType.ProductPurchase,
          status: OrderStatus.Completed,
          amount_try: priceTry,
          currency: 'TRY',
          gateway_transaction_id: null,
          gateway_conversation_id: null,
          reference_id: productId,
          created_at: now,
          completed_at: now,
        }),
      );
      const purchase = await manager.save(
        manager.create(ProductPurchase, {
          fan_user_id: userId,
          product_id: productId,
          order_id: order.id,
          amount_paid_try: priceTry,
          purchased_at: now,
          access_revoked_at: null,
        }),
      );
      return { order, purchase };
    });

    await this.notificationService.createNotification({
      recipientUserId: userId,
      type: NotificationType.OrderConfirmed,
      title: 'Satın alımınız onaylandı',
      body: 'Dijital ürününüz kütüphanenize eklendi.',
      actionUrl: '/kutuphane',
    });

    return {
      order_id: result.order.id,
      product_id: productId,
      amount_paid_try: result.purchase.amount_paid_try,
      purchased_at: result.purchase.purchased_at,
      mock: true,
    };
  }

  private async realPurchaseProduct(userId: string, productId: string, product: Product) {
    const conversationId = randomUUID();
    const callbackUrl = this.configService.get<string>(
      'CHECKOUT_CALLBACK_URL',
      'http://localhost:3001/checkout/callback',
    );

    // Create pending order first
    const now = new Date();
    const order = await this.orderRepository.save(
      this.orderRepository.create({
        fan_user_id: userId,
        order_type: OrderType.ProductPurchase,
        status: OrderStatus.Pending,
        amount_try: product.price_try,
        currency: 'TRY',
        gateway_transaction_id: null,
        gateway_conversation_id: conversationId,
        reference_id: productId,
        created_at: now,
        completed_at: null,
      }),
    );

    const priceTRY = (product.price_try / 100).toFixed(2);

    const iyzicoRequest = {
      locale: 'tr',
      conversationId,
      price: priceTRY,
      paidPrice: priceTRY,
      currency: 'TRY',
      basketId: order.id,
      paymentGroup: 'PRODUCT',
      callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: userId,
        name: 'Fan',
        surname: 'User',
        gsmNumber: '+905000000000',
        email: `${userId}@lalabits.art`,
        identityNumber: '11111111111',
        registrationAddress: 'Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
      billingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
      basketItems: [
        {
          id: productId,
          name: product.title,
          category1: 'DigitalProduct',
          itemType: 'VIRTUAL',
          price: priceTRY,
        },
      ],
    };

    const iyzicoResult = await this.iyzicoService.initializeCheckoutForm(iyzicoRequest);

    if (iyzicoResult.status !== 'success' || !iyzicoResult.checkoutFormContent) {
      await this.orderRepository.update({ id: order.id }, { status: OrderStatus.Failed });
      this.logger.error(`İyzico checkout init failed: ${iyzicoResult.errorMessage}`);
      throw new InternalServerErrorException('PAYMENT_INIT_FAILED');
    }

    return {
      order_id: order.id,
      conversation_id: conversationId,
      checkout_form_content: iyzicoResult.checkoutFormContent,
    };
  }

  // ── PURCHASE — COLLECTION ────────────────────────────────────────────────

  async purchaseCollection(userId: string, collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
        publish_status: CollectionPublishStatus.Published,
        moderation_status: CollectionModerationStatus.Clean,
      },
    });

    if (!collection) {
      throw new NotFoundException('COLLECTION_NOT_FOUND');
    }

    if (collection.access_type !== CollectionAccessType.Purchase) {
      throw new UnprocessableEntityException('COLLECTION_NOT_PURCHASABLE');
    }

    if (collection.price_try == null) {
      throw new UnprocessableEntityException('COLLECTION_PRICE_MISSING');
    }

    const creatorProfile = await this.creatorProfileRepository.findOne({
      where: { id: collection.creator_profile_id },
    });
    if (creatorProfile?.user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_PURCHASE_OWN');
    }

    const existing = await this.collectionPurchaseRepository.findOne({
      where: { fan_user_id: userId, collection_id: collectionId, access_revoked_at: IsNull() },
    });
    if (existing) {
      throw new ConflictException('ALREADY_PURCHASED');
    }

    if (!this.iyzicoService.isEnabled) {
      return this.mockPurchaseCollection(userId, collectionId, collection.price_try);
    }

    return this.realPurchaseCollection(userId, collectionId, collection);
  }

  private async mockPurchaseCollection(userId: string, collectionId: string, priceTry: number) {
    const now = new Date();
    const result = await this.dataSource.transaction(async (manager) => {
      const order = await manager.save(
        manager.create(Order, {
          fan_user_id: userId,
          order_type: OrderType.CollectionPurchase,
          status: OrderStatus.Completed,
          amount_try: priceTry,
          currency: 'TRY',
          gateway_transaction_id: null,
          gateway_conversation_id: null,
          reference_id: collectionId,
          created_at: now,
          completed_at: now,
        }),
      );
      const purchase = await manager.save(
        manager.create(CollectionPurchase, {
          fan_user_id: userId,
          collection_id: collectionId,
          order_id: order.id,
          amount_paid_try: priceTry,
          purchased_at: now,
          access_revoked_at: null,
        }),
      );
      return { order, purchase };
    });

    await this.notificationService.createNotification({
      recipientUserId: userId,
      type: NotificationType.OrderConfirmed,
      title: 'Satın alımınız onaylandı',
      body: 'Koleksiyon kütüphanenize eklendi.',
      actionUrl: '/kutuphane',
    });

    return {
      order_id: result.order.id,
      collection_id: collectionId,
      amount_paid_try: result.purchase.amount_paid_try,
      purchased_at: result.purchase.purchased_at,
      mock: true,
    };
  }

  private async realPurchaseCollection(userId: string, collectionId: string, collection: Collection) {
    const conversationId = randomUUID();
    const callbackUrl = this.configService.get<string>(
      'CHECKOUT_CALLBACK_URL',
      'http://localhost:3001/checkout/callback',
    );

    const now = new Date();
    const order = await this.orderRepository.save(
      this.orderRepository.create({
        fan_user_id: userId,
        order_type: OrderType.CollectionPurchase,
        status: OrderStatus.Pending,
        amount_try: collection.price_try!,
        currency: 'TRY',
        gateway_transaction_id: null,
        gateway_conversation_id: conversationId,
        reference_id: collectionId,
        created_at: now,
        completed_at: null,
      }),
    );

    const priceTRY = (collection.price_try! / 100).toFixed(2);

    const iyzicoRequest = {
      locale: 'tr',
      conversationId,
      price: priceTRY,
      paidPrice: priceTRY,
      currency: 'TRY',
      basketId: order.id,
      paymentGroup: 'PRODUCT',
      callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: userId,
        name: 'Fan',
        surname: 'User',
        gsmNumber: '+905000000000',
        email: `${userId}@lalabits.art`,
        identityNumber: '11111111111',
        registrationAddress: 'Türkiye',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
      billingAddress: { contactName: 'Fan User', city: 'Istanbul', country: 'Turkey', address: 'Türkiye' },
      basketItems: [
        {
          id: collectionId,
          name: collection.title,
          category1: 'DigitalCollection',
          itemType: 'VIRTUAL',
          price: priceTRY,
        },
      ],
    };

    const iyzicoResult = await this.iyzicoService.initializeCheckoutForm(iyzicoRequest);

    if (iyzicoResult.status !== 'success' || !iyzicoResult.checkoutFormContent) {
      await this.orderRepository.update({ id: order.id }, { status: OrderStatus.Failed });
      this.logger.error(`İyzico checkout init failed: ${iyzicoResult.errorMessage}`);
      throw new InternalServerErrorException('PAYMENT_INIT_FAILED');
    }

    return {
      order_id: order.id,
      conversation_id: conversationId,
      checkout_form_content: iyzicoResult.checkoutFormContent,
    };
  }

  // ── CHECKOUT CALLBACK (İyzico → backend) ─────────────────────────────────
  // Called by İyzico redirect after 3DS. Returns conversationId for frontend redirect.

  async finalizeCheckoutByToken(token: string): Promise<{ conversationId: string; status: string }> {
    const iyzicoResult = await this.iyzicoService.retrieveCheckoutFormResult({ token });

    const conversationId = iyzicoResult.conversationId ?? '';

    const order = await this.orderRepository.findOne({
      where: { gateway_conversation_id: conversationId },
    });

    if (!order) {
      this.logger.error(`Checkout callback: no order for conversationId=${conversationId}`);
      return { conversationId, status: OrderStatus.Failed };
    }

    // Idempotency: already finalized
    if (order.status !== OrderStatus.Pending) {
      return { conversationId, status: order.status };
    }

    if (iyzicoResult.status !== 'success') {
      await this.orderRepository.update({ id: order.id }, { status: OrderStatus.Failed });
      return { conversationId, status: OrderStatus.Failed };
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Order, { id: order.id }, {
        status: OrderStatus.Completed,
        gateway_transaction_id: iyzicoResult.paymentId ?? null,
        completed_at: now,
      });

      if (order.order_type === OrderType.ProductPurchase) {
        await manager.save(
          manager.create(ProductPurchase, {
            fan_user_id: order.fan_user_id,
            product_id: order.reference_id,
            order_id: order.id,
            amount_paid_try: order.amount_try,
            purchased_at: now,
            access_revoked_at: null,
          }),
        );
      } else if (order.order_type === OrderType.CollectionPurchase) {
        await manager.save(
          manager.create(CollectionPurchase, {
            fan_user_id: order.fan_user_id,
            collection_id: order.reference_id,
            order_id: order.id,
            amount_paid_try: order.amount_try,
            purchased_at: now,
            access_revoked_at: null,
          }),
        );
      }

      await manager.save(
        manager.create(Invoice, {
          fan_user_id: order.fan_user_id,
          order_id: order.id,
          membership_subscription_id: null,
          invoice_type: InvoiceType.OneTimePurchase,
          amount_try: order.amount_try,
          currency: 'TRY',
          status: InvoiceStatus.Paid,
          gateway_invoice_id: iyzicoResult.paymentId ?? null,
          issued_at: now,
          paid_at: now,
        }),
      );
    });

    await this.notificationService.createNotification({
      recipientUserId: order.fan_user_id,
      type: NotificationType.OrderConfirmed,
      title: 'Satın alımınız onaylandı',
      body: order.order_type === OrderType.ProductPurchase
        ? 'Dijital ürününüz kütüphanenize eklendi.'
        : 'Koleksiyon kütüphanenize eklendi.',
      actionUrl: '/kutuphane',
    });

    // TODO: analytics event — purchase_completed

    return { conversationId, status: OrderStatus.Completed };
  }
}
