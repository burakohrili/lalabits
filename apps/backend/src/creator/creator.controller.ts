import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreatorCategory } from './entities/creator-profile.entity';
import { EarningStatus } from '../billing/entities/creator-earning.entity';
import { PayoutStatus } from '../billing/entities/creator-payout.entity';
import { UpdateBillingInfoDto } from './dto/update-billing-info.dto';

@Controller()
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get('creators')
  @HttpCode(HttpStatus.OK)
  listCreators(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const validCategories = Object.values(CreatorCategory) as string[];
    if (category !== undefined && !validCategories.includes(category)) {
      throw new BadRequestException('INVALID_CATEGORY');
    }
    return this.creatorService.listCreators({
      q,
      category: category as CreatorCategory | undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('creator/status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.creatorService.getStatus(user.id);
  }

  @Get('creators/:username')
  @HttpCode(HttpStatus.OK)
  getPublicProfile(@Param('username') username: string) {
    return this.creatorService.getPublicProfile(username);
  }

  @Patch('creator-profile/billing-info')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateBillingInfo(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateBillingInfoDto,
  ) {
    return this.creatorService.updateBillingInfo(user.id, dto);
  }

  // ── Creator Earnings ───────────────────────────────────────────────────────

  @Get('creator/earnings')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listEarnings(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: EarningStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.creatorService.listCreatorEarnings(user.id, {
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      status,
    });
  }

  // ── Creator Payouts ────────────────────────────────────────────────────────

  @Get('creator/payouts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listPayouts(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: PayoutStatus,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.creatorService.listCreatorPayouts(user.id, {
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      status,
    });
  }

  // ── Payout Documents ───────────────────────────────────────────────────────

  @Get('creator/payouts/:id/documents')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  listPayoutDocuments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') payoutId: string,
  ) {
    return this.creatorService.listPayoutDocuments(user.id, payoutId);
  }

  @Post('creator/payouts/:id/documents')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadPayoutDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') payoutId: string,
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string },
    @Body('document_type') documentType: string,
  ) {
    return this.creatorService.uploadPayoutDocument(user.id, payoutId, file, documentType);
  }
}
