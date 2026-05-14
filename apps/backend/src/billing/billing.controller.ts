import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { PaymentDisputeStatus } from './entities/payment-dispute.entity';
import { UpsertFanBillingProfileDto } from './dto/upsert-fan-billing-profile.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listInvoices(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.billingService.listInvoices(user.id, Number(page), Number(limit));
  }

  // ── Fan Disputes ──────────────────────────────────────────────────────────

  @Post('disputes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createDispute(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.billingService.createDispute(user.id, dto);
  }

  @Get('disputes')
  @UseGuards(JwtAuthGuard)
  listFanDisputes(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.billingService.listFanDisputes(user.id, page, limit);
  }

  // ── Fan Billing Profile ───────────────────────────────────────────────────

  @Get('billing/fan-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getFanBillingProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.billingService.getFanBillingProfile(user.id);
  }

  @Post('billing/fan-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  createFanBillingProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertFanBillingProfileDto,
  ) {
    return this.billingService.upsertFanBillingProfile(user.id, dto);
  }

  @Put('billing/fan-profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateFanBillingProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpsertFanBillingProfileDto,
  ) {
    return this.billingService.upsertFanBillingProfile(user.id, dto);
  }

  // ── Admin Disputes ────────────────────────────────────────────────────────

  @Get('admin/disputes')
  @UseGuards(JwtAuthGuard, AdminGuard)
  adminListDisputes(
    @Query('status') status?: PaymentDisputeStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.billingService.adminListDisputes(status, page, limit);
  }

  @Put('admin/disputes/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  adminUpdateDispute(
    @Param('id') id: string,
    @Body() dto: UpdateDisputeDto,
  ) {
    return this.billingService.adminUpdateDispute(id, dto);
  }
}
