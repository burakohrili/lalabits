import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  // ── PUBLIC STORE ENDPOINTS — move to StoreModule when extracted ──────────

  @Get('store/products/:id')
  @HttpCode(HttpStatus.OK)
  getProductPreview(@Param('id') productId: string) {
    return this.checkoutService.getProductPreview(productId);
  }

  @Get('store/collections/:id')
  @HttpCode(HttpStatus.OK)
  getCollectionPreview(@Param('id') collectionId: string) {
    return this.checkoutService.getCollectionPreview(collectionId);
  }

  // ── PURCHASE STATUS (auth required) ─────────────────────────────────────

  @Get('checkout/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getPurchaseStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Query('product_id') productId?: string,
    @Query('collection_id') collectionId?: string,
  ) {
    return this.checkoutService.getPurchaseStatus(user.id, productId, collectionId);
  }

  // ── CHECKOUT RESULT POLL (LD-1: route contract preserved) ───────────────

  @Get('checkout/result/:conversation_id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getCheckoutResult(
    @CurrentUser() user: AuthenticatedUser,
    @Param('conversation_id') conversationId: string,
  ) {
    return this.checkoutService.getCheckoutResult(user.id, conversationId);
  }

  // ── İYZİCO CALLBACK (no auth — browser redirect from İyzico hosted form) ─
  // İyzico POSTs a form with token after 3DS completes.
  // We finalize the order, then redirect the browser to the result page.

  @Post('checkout/callback')
  async checkoutCallback(
    @Body('token') token: string,
    @Res() res: Response,
  ) {
    let conversationId = '';
    let finalStatus = 'failed';

    try {
      const result = await this.checkoutService.finalizeCheckoutByToken(token ?? '');
      conversationId = result.conversationId;
      finalStatus = result.status;
    } catch (err) {
      // Finalization errors still redirect — fan sees failure on result page
    }

    const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',')[0].trim();
    res.redirect(
      `${frontendUrl}/odeme/sonuc?conversation_id=${conversationId}&status=${finalStatus}`,
    );
  }

  // ── CHECKOUT — PRODUCT (LD-1: route contract preserved) ─────────────────

  @Post('checkout/products/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  purchaseProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.checkoutService.purchaseProduct(user.id, productId);
  }

  // ── CHECKOUT — COLLECTION (LD-1: route contract preserved) ──────────────

  @Post('checkout/collections/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  purchaseCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.checkoutService.purchaseCollection(user.id, collectionId);
  }
}
