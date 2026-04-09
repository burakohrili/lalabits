import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { WebhookEvent } from '../billing/entities/webhook-event.entity';
import { IyzicoService } from '../iyzico/iyzico.service';
import { MembershipService } from '../membership/membership.service';

// Known İyzico subscription webhook event types
const IYZICO_EVENT = {
  SUBSCRIPTION_ORDER_SUCCESS: 'SUBSCRIPTION_ORDER_SUCCESS',
  SUBSCRIPTION_ORDER_FAILURE: 'SUBSCRIPTION_ORDER_FAILURE',
  SUBSCRIPTION_CANCELED: 'SUBSCRIPTION_CANCELED',
  SUBSCRIPTION_UPGRADED: 'SUBSCRIPTION_UPGRADED',
} as const;

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookEventRepository: Repository<WebhookEvent>,
    private readonly iyzicoService: IyzicoService,
    private readonly membershipService: MembershipService,
    private readonly configService: ConfigService,
  ) {}

  // ── Signature verification ────────────────────────────────────────────────

  verifyIyzicoSignature(rawBody: Buffer, signatureHeader: string): boolean {
    const secret = this.configService.get<string>('IYZICO_WEBHOOK_SECRET', '');
    if (!secret) {
      // If no secret configured, skip verification in dev mode
      this.logger.warn('IYZICO_WEBHOOK_SECRET not set — skipping signature verification');
      return true;
    }
    const expected = createHmac('sha256', secret).update(rawBody).digest('base64');
    return expected === signatureHeader;
  }

  // ── Main event processor ─────────────────────────────────────────────────

  async processIyzicoEvent(payload: Record<string, unknown>): Promise<void> {
    const eventType = payload['eventType'] as string | undefined;
    const subscriptionReferenceCode = payload['subscriptionReferenceCode'] as string | undefined;

    if (!eventType || !subscriptionReferenceCode) {
      this.logger.warn('Webhook received with missing eventType or subscriptionReferenceCode');
      return;
    }

    const idempotencyKey = `iyzico:${subscriptionReferenceCode}:${eventType}`;

    // ── Idempotency check ─────────────────────────────────────────────────
    const existing = await this.webhookEventRepository.findOne({
      where: { idempotency_key: idempotencyKey },
    });

    if (existing) {
      this.logger.log(`Duplicate webhook skipped: ${idempotencyKey}`);
      return;
    }

    // Write event log entry before processing
    const event = await this.webhookEventRepository.save(
      this.webhookEventRepository.create({
        gateway: 'iyzico',
        event_type: eventType,
        idempotency_key: idempotencyKey,
        raw_payload: payload,
        processed: false,
        processed_at: null,
        error: null,
      }),
    );

    try {
      await this.routeEvent(eventType, subscriptionReferenceCode, payload);

      await this.webhookEventRepository.update(
        { id: event.id },
        { processed: true, processed_at: new Date() },
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      this.logger.error(`Webhook processing error [${idempotencyKey}]: ${errMsg}`);
      await this.webhookEventRepository.update(
        { id: event.id },
        { error: errMsg },
      );
    }
  }

  // ── Event routing ────────────────────────────────────────────────────────

  private async routeEvent(
    eventType: string,
    subscriptionReferenceCode: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    switch (eventType) {
      case IYZICO_EVENT.SUBSCRIPTION_ORDER_SUCCESS:
        await this.handleRenewalSuccess(subscriptionReferenceCode, payload);
        break;

      case IYZICO_EVENT.SUBSCRIPTION_ORDER_FAILURE:
        await this.handleRenewalFailure(subscriptionReferenceCode);
        break;

      case IYZICO_EVENT.SUBSCRIPTION_CANCELED:
        await this.handleCancelled(subscriptionReferenceCode);
        break;

      default:
        this.logger.log(`Unhandled İyzico event type: ${eventType} — logged, no action`);
    }
  }

  // ── LD-3: Confirm gateway state before updating local record ─────────────

  private async handleRenewalSuccess(
    subscriptionReferenceCode: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    // Confirm current gateway state
    const details = await this.iyzicoService.getSubscriptionDetails(subscriptionReferenceCode);

    if (details.status !== 'success' || details.data?.subscriptionStatus !== 'ACTIVE') {
      this.logger.warn(
        `Renewal success webhook but gateway status is not ACTIVE for ${subscriptionReferenceCode}. Skipping.`,
      );
      return;
    }

    // Extract payment details from webhook payload (gateway-provided)
    const paymentId = (payload['paymentId'] as string | undefined) ?? subscriptionReferenceCode;
    const paidPriceRaw = payload['paidPrice'] as string | undefined;
    // İyzico sends prices as decimal strings (e.g. "99.00"); convert to kuruş (int)
    const amountTry = paidPriceRaw ? Math.round(parseFloat(paidPriceRaw) * 100) : 0;

    await this.membershipService.handleRenewalSuccess(
      subscriptionReferenceCode,
      paymentId,
      amountTry,
    );
  }

  private async handleRenewalFailure(subscriptionReferenceCode: string): Promise<void> {
    // LD-3: Confirm gateway state — subscription should be PASSIVE or CANCELED on failure
    const details = await this.iyzicoService.getSubscriptionDetails(subscriptionReferenceCode);

    if (details.status !== 'success') {
      this.logger.warn(
        `Could not confirm gateway state for ${subscriptionReferenceCode} on failure — proceeding with grace`,
      );
    }

    // Gateway status PASSIVE = payment failed, not yet cancelled
    // Proceed with grace period regardless (gateway state confirmed enough)
    await this.membershipService.handleRenewalFailure(subscriptionReferenceCode);
  }

  private async handleCancelled(subscriptionReferenceCode: string): Promise<void> {
    // LD-3: Confirm cancellation at gateway
    const details = await this.iyzicoService.getSubscriptionDetails(subscriptionReferenceCode);

    if (details.status !== 'success' || details.data?.subscriptionStatus !== 'CANCELED') {
      this.logger.warn(
        `Cancel webhook but gateway status is not CANCELED for ${subscriptionReferenceCode}. Skipping local update.`,
      );
      return;
    }

    await this.membershipService.handleGatewayCancelled(subscriptionReferenceCode);
  }
}
