import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorOnboardingGuard } from './guards/creator-onboarding.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { SubmitApplicationDto } from './dto/submit-application.dto';

@Controller('onboarding')
@UseGuards(JwtAuthGuard, CreatorOnboardingGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  getStatus(@CurrentUser() user: AuthenticatedUser) {
    return this.onboardingService.getStatus(user.id);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.onboardingService.updateProfile(user.id, dto);
  }

  @Put('category')
  @HttpCode(HttpStatus.OK)
  updateCategory(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.onboardingService.updateCategory(user.id, dto);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  createPlan(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePlanDto,
  ) {
    return this.onboardingService.createPlan(user.id, dto);
  }

  @Put('plans/:planId')
  @HttpCode(HttpStatus.OK)
  updatePlan(
    @CurrentUser() user: AuthenticatedUser,
    @Param('planId') planId: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.onboardingService.updatePlan(user.id, planId, dto);
  }

  @Put('payout')
  @HttpCode(HttpStatus.OK)
  updatePayout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdatePayoutDto,
  ) {
    return this.onboardingService.updatePayout(user.id, dto);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  submitApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SubmitApplicationDto,
    @Req() req: Request,
  ) {
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      (typeof forwarded === 'string' ? forwarded : forwarded?.[0])
        ?.split(',')[0]
        ?.trim() ??
      req.ip ??
      null;
    return this.onboardingService.submitApplication(user.id, dto, ipAddress);
  }
}
