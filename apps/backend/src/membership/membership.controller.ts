import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { MembershipService } from './membership.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { MembershipSubscriptionStatus } from '../billing/entities/membership-subscription.entity';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // ── PLAN PREVIEW (public — no auth) ──────────────────────────────────────

  @Get('plans/:id')
  @HttpCode(HttpStatus.OK)
  getPlanPreview(@Param('id') planId: string) {
    return this.membershipService.getPlanPreview(planId);
  }

  // ── SUBSCRIBE ─────────────────────────────────────────────────────────────
  // Mock path: returns { subscription_id, plan_id, status, current_period_end, mock: true }
  // Real path: returns { subscription_id, conversation_id, plan_id, checkout_form_content }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  subscribe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubscribeDto,
  ) {
    return this.membershipService.subscribe(user.id, dto);
  }

  // ── İYZİCO SUBSCRIPTION CALLBACK (no auth — browser redirect from İyzico) ─
  // LD-3: token → retrieveSubscriptionCheckoutFormResult → confirm state → update local

  @Post('callback')
  async subscriptionCallback(
    @Body('token') token: string,
    @Res() res: Response,
  ) {
    let conversationId = '';
    let finalStatus = 'failed';

    try {
      const result = await this.membershipService.finalizeSubscriptionByToken(token ?? '');
      conversationId = result.conversationId;
      finalStatus = result.status;
    } catch {
      // Still redirect — fan sees failure on result page
    }

    const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:3000').split(',')[0].trim();
    res.redirect(
      `${frontendUrl}/odeme/sonuc?type=subscription&conversation_id=${conversationId}&status=${finalStatus}`,
    );
  }

  // ── SUBSCRIPTION RESULT POLL ──────────────────────────────────────────────

  @Get('result/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getSubscriptionResult(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') subscriptionId: string,
  ) {
    return this.membershipService.getSubscriptionResult(user.id, subscriptionId);
  }

  // ── STATUS ────────────────────────────────────────────────────────────────

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Query('creator_username') creatorUsername: string,
  ) {
    return this.membershipService.getStatus(user.id, creatorUsername);
  }

  @Get('subscriptions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listSubscriptions(@CurrentUser() user: AuthenticatedUser) {
    return this.membershipService.listSubscriptions(user.id);
  }

  // ── SUBSCRIPTION HISTORY (billing page — all statuses including expired/pending) ──

  @Get('subscriptions/history')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listSubscriptionHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: MembershipSubscriptionStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.membershipService.listSubscriptionHistory(
      user.id,
      status,
      Number(page),
      Number(limit),
    );
  }

  // ── CANCEL (LD-1: route contract preserved — DELETE /membership/subscriptions/:id) ─

  @Delete('subscriptions/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  cancel(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') subscriptionId: string,
  ) {
    return this.membershipService.cancel(user.id, subscriptionId);
  }

  // ── PAUSE / RESUME ────────────────────────────────────────────────────────

  @Post('subscriptions/:id/pause')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  pause(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') subscriptionId: string,
  ) {
    return this.membershipService.pauseSubscription(user.id, subscriptionId);
  }

  @Post('subscriptions/:id/resume')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  resume(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') subscriptionId: string,
  ) {
    return this.membershipService.resumeSubscription(user.id, subscriptionId);
  }
}
