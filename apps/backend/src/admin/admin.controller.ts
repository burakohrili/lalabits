import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { SuspendCreatorDto } from './dto/suspend-creator.dto';
import { ModerationDecisionDto } from './dto/moderation-decision.dto';
import { CreatorApplicationDecision } from '../creator/entities/creator-application.entity';
import { CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { ReportStatus, ReportTargetType } from '../moderation/entities/report.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ── Overview ────────────────────────────────────────────────────────────

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  getOverview() {
    return this.adminService.getOverview();
  }

  // ── Creator Applications ─────────────────────────────────────────────────

  @Get('creator-applications')
  @HttpCode(HttpStatus.OK)
  listApplications(
    @Query('decision') decision: CreatorApplicationDecision = CreatorApplicationDecision.Pending,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.listApplications(
      decision,
      Number(page),
      Number(limit),
    );
  }

  @Get('creator-applications/:id')
  @HttpCode(HttpStatus.OK)
  getApplication(@Param('id') id: string) {
    return this.adminService.getApplication(id);
  }

  @Post('creator-applications/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveApplication(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.adminService.approveApplication(id, user.id);
  }

  @Post('creator-applications/:id/reject')
  @HttpCode(HttpStatus.OK)
  rejectApplication(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RejectApplicationDto,
  ) {
    return this.adminService.rejectApplication(id, user.id, dto);
  }

  @Post('creator-applications/:id/suspend')
  @HttpCode(HttpStatus.OK)
  suspendCreatorByApplication(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SuspendCreatorDto,
  ) {
    return this.adminService.suspendCreator(id, user.id, dto);
  }

  // ── Creator Management ───────────────────────────────────────────────────

  @Get('creators')
  @HttpCode(HttpStatus.OK)
  listCreators(
    @Query('status') status?: CreatorProfileStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.listCreators(status, Number(page), Number(limit));
  }

  @Get('creators/:profileId')
  @HttpCode(HttpStatus.OK)
  getCreatorDetail(@Param('profileId') profileId: string) {
    return this.adminService.getCreatorDetail(profileId);
  }

  @Post('creators/:profileId/suspend')
  @HttpCode(HttpStatus.OK)
  suspendCreatorByProfileId(
    @Param('profileId') profileId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SuspendCreatorDto,
  ) {
    return this.adminService.suspendCreatorByProfileId(profileId, user.id, dto);
  }

  @Post('creators/:profileId/unsuspend')
  @HttpCode(HttpStatus.OK)
  unsuspendCreator(
    @Param('profileId') profileId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SuspendCreatorDto,
  ) {
    return this.adminService.unsuspendCreator(profileId, user.id, dto);
  }

  // ── Report Queue ─────────────────────────────────────────────────────────

  @Get('reports')
  @HttpCode(HttpStatus.OK)
  listReports(
    @Query('status') status: ReportStatus = ReportStatus.Open,
    @Query('target_type') targetType?: ReportTargetType,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminService.listReports(
      status,
      targetType,
      Number(page),
      Number(limit),
    );
  }

  @Get('reports/:id')
  @HttpCode(HttpStatus.OK)
  getReport(@Param('id') id: string) {
    return this.adminService.getReport(id);
  }

  @Post('reports/:id/remove')
  @HttpCode(HttpStatus.OK)
  removeContent(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ModerationDecisionDto,
  ) {
    return this.adminService.removeContent(id, user.id, dto);
  }

  @Post('reports/:id/dismiss')
  @HttpCode(HttpStatus.OK)
  dismissReport(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ModerationDecisionDto,
  ) {
    return this.adminService.dismissReport(id, user.id, dto);
  }

  @Post('reports/:id/restore')
  @HttpCode(HttpStatus.OK)
  restoreContent(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ModerationDecisionDto,
  ) {
    return this.adminService.restoreContent(id, user.id, dto);
  }
}
