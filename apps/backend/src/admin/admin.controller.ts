import {
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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { SuspendCreatorDto } from './dto/suspend-creator.dto';
import { ModerationDecisionDto } from './dto/moderation-decision.dto';
import { CreateContentViolationDto, UpdateContentViolationDto } from './dto/content-violation.dto';
import { CreatorApplicationDecision } from '../creator/entities/creator-application.entity';
import { CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { ReportStatus, ReportTargetType } from '../moderation/entities/report.entity';
import { ViolationStatus } from '../moderation/entities/content-policy-violation.entity';
import { InvoiceStatus } from '../billing/entities/invoice.entity';
import { MembershipSubscriptionStatus } from '../billing/entities/membership-subscription.entity';
import { EarningStatus } from '../billing/entities/creator-earning.entity';
import { PayoutStatus } from '../billing/entities/creator-payout.entity';
import { RefundStatus } from '../billing/entities/refund-request.entity';
import { RiskSeverity } from '../billing/entities/risk-event.entity';

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

  // ── Payments ──────────────────────────────────────────────────────────────

  @Get('odemeler')
  listInvoices(
    @Query('status') status?: InvoiceStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listInvoices(status, page, limit);
  }

  @Get('abonelikler')
  listSubscriptions(
    @Query('status') status?: MembershipSubscriptionStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listSubscriptions(status, page, limit);
  }

  // ── Content Policy Violations ─────────────────────────────────────────────

  @Get('content-violations')
  @HttpCode(HttpStatus.OK)
  listContentViolations(
    @Query('status') status?: ViolationStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listContentViolations(status, page, limit);
  }

  @Get('content-violations/:id')
  @HttpCode(HttpStatus.OK)
  getContentViolation(@Param('id') id: string) {
    return this.adminService.getContentViolation(id);
  }

  @Post('content-violations')
  @HttpCode(HttpStatus.CREATED)
  createContentViolation(
    @Body() dto: CreateContentViolationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.adminService.createContentViolation(dto, user.id);
  }

  @Patch('content-violations/:id')
  @HttpCode(HttpStatus.OK)
  updateContentViolation(
    @Param('id') id: string,
    @Body() dto: UpdateContentViolationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.adminService.updateContentViolation(id, dto, user.id);
  }

  // ── Statistics ────────────────────────────────────────────────────────────

  @Get('istatistikler')
  getStatistics() {
    return this.adminService.getStatistics();
  }

  // ── Conversation Inspection ───────────────────────────────────────────────

  @Get('conversations')
  listConversations(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listConversations(page, limit);
  }

  @Get('conversations/:id/messages')
  getConversationMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit = 50,
  ) {
    return this.adminService.getConversationMessages(id, page, limit);
  }

  // ── Finance: Earnings ─────────────────────────────────────────────────────

  @Get('earnings')
  listEarnings(
    @Query('creator_id') creatorId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('status') status?: EarningStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listEarnings({
      creatorId,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      status,
      page,
      limit,
    });
  }

  // ── Finance: Payouts ──────────────────────────────────────────────────────

  @Get('payouts')
  listPayouts(
    @Query('creator_id') creatorId?: string,
    @Query('status') status?: PayoutStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listPayouts({ creatorId, status, page, limit });
  }

  @Post('payouts/:id/mark-paid')
  @HttpCode(HttpStatus.OK)
  markPayoutPaid(@Param('id') id: string) {
    return this.adminService.markPayoutPaid(id);
  }

  // ── Finance: Refund Requests ──────────────────────────────────────────────

  @Get('refund-requests')
  listRefundRequests(
    @Query('status') status?: RefundStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listRefundRequests({ status, page, limit });
  }

  @Patch('refund-requests/:id')
  @HttpCode(HttpStatus.OK)
  updateRefundRequest(
    @Param('id') id: string,
    @Body() dto: { status: RefundStatus; notes?: string },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.adminService.updateRefundRequest(id, dto, user.id);
  }

  // ── Finance: Risk Events ──────────────────────────────────────────────────

  @Get('risk-events')
  listRiskEvents(
    @Query('severity') severity?: RiskSeverity,
    @Query('resolved') resolved?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.adminService.listRiskEvents({
      severity,
      resolved: resolved !== undefined ? resolved === 'true' : undefined,
      page,
      limit,
    });
  }

  @Patch('risk-events/:id/resolve')
  @HttpCode(HttpStatus.OK)
  resolveRiskEvent(@Param('id') id: string) {
    return this.adminService.resolveRiskEvent(id);
  }
}
