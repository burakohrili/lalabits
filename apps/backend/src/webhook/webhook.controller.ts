import {
  Controller,
  Post,
  Headers,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  // ── İyzico webhook intake ────────────────────────────────────────────────
  // No JwtAuthGuard — gateway posts unauthenticated.
  // Signature verified via HMAC-SHA256 before processing.
  // Always returns 200: gateway must not retry on our processing errors.

  @Post('iyzico')
  @HttpCode(HttpStatus.OK)
  async iyzicoWebhook(
    @Req() req: Request,
    @Headers('x-iyz-signature') signatureHeader: string,
  ) {
    const rawBody: Buffer = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body));

    const isValid = this.webhookService.verifyIyzicoSignature(rawBody, signatureHeader ?? '');
    if (!isValid) {
      this.logger.warn('İyzico webhook rejected: invalid signature');
      // Return 200 to avoid gateway retries on a rejected event
      return { received: false };
    }

    const payload = req.body as Record<string, unknown>;

    // Fire-and-forget with error capture — always return 200
    this.webhookService.processIyzicoEvent(payload).catch((err) => {
      this.logger.error('Webhook async processing error:', err);
    });

    return { received: true };
  }
}
