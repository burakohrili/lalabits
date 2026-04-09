import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatorApplication, CreatorApplicationDecision } from '../creator/entities/creator-application.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { ModerationAction, ModerationActionType, ModerationTargetType } from '../moderation/entities/moderation-action.entity';
import { Report, ReportStatus, ReportTargetType } from '../moderation/entities/report.entity';
import { Post, PostModerationStatus } from '../content/entities/post.entity';
import { Product, ProductModerationStatus } from '../content/entities/product.entity';
import { Collection, CollectionModerationStatus } from '../content/entities/collection.entity';
import { User } from '../auth/entities/user.entity';
import { LegalDocumentVersion } from '../legal/entities/legal-document-version.entity';
import { MembershipPlan } from '../creator/entities/membership-plan.entity';
import { MembershipSubscription, MembershipSubscriptionStatus } from '../billing/entities/membership-subscription.entity';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { SuspendCreatorDto } from './dto/suspend-creator.dto';
import { ModerationDecisionDto } from './dto/moderation-decision.dto';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../moderation/entities/notification.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(CreatorApplication)
    private readonly applicationRepository: Repository<CreatorApplication>,
    @InjectRepository(CreatorProfile)
    private readonly profileRepository: Repository<CreatorProfile>,
    @InjectRepository(ModerationAction)
    private readonly moderationActionRepository: Repository<ModerationAction>,
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LegalDocumentVersion)
    private readonly legalDocVersionRepository: Repository<LegalDocumentVersion>,
    @InjectRepository(MembershipPlan)
    private readonly membershipPlanRepository: Repository<MembershipPlan>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepository: Repository<MembershipSubscription>,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  // ── Overview ──────────────────────────────────────────────────────────────

  async getOverview() {
    const [pendingCount, openReportsCount] = await Promise.all([
      this.applicationRepository.count({
        where: { decision: CreatorApplicationDecision.Pending },
      }),
      this.reportRepository.count({
        where: { status: ReportStatus.Open },
      }),
    ]);

    return {
      pending_applications_count: pendingCount,
      open_reports_count: openReportsCount,
    };
  }

  // ── Creator Applications ───────────────────────────────────────────────────

  async listApplications(
    decision: CreatorApplicationDecision = CreatorApplicationDecision.Pending,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;

    const [applications, total] = await this.applicationRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.creator_profile', 'profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('app.decision = :decision', { decision })
      .orderBy('app.submitted_at', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    const items = applications.map((app) => ({
      id: app.id,
      creator_profile_id: app.creator_profile_id,
      submitted_at: app.submitted_at,
      resubmission_count: app.resubmission_count,
      decision: app.decision,
      creator: {
        display_name: app.creator_profile?.display_name ?? null,
        username: app.creator_profile?.username ?? null,
        category: app.creator_profile?.category ?? null,
        email: app.creator_profile?.user?.email ?? null,
      },
    }));

    return { items, total, page, limit };
  }

  async getApplication(applicationId: string) {
    const app = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!app) {
      throw new NotFoundException('APPLICATION_NOT_FOUND');
    }

    const profile = await this.profileRepository.findOne({
      where: { id: app.creator_profile_id },
    });

    const user = profile
      ? await this.userRepository.findOne({ where: { id: profile.user_id } })
      : null;

    const agreementVersion = await this.legalDocVersionRepository.findOne({
      where: { id: app.agreement_version_id },
    });

    const membershipPlans = profile
      ? await this.membershipPlanRepository.find({
          where: { creator_profile_id: profile.id },
          order: { tier_rank: 'ASC' },
        })
      : [];

    return {
      id: app.id,
      submitted_at: app.submitted_at,
      reviewed_at: app.reviewed_at,
      reviewed_by_admin_id: app.reviewed_by_admin_id,
      decision: app.decision,
      rejection_reason: app.rejection_reason,
      resubmission_count: app.resubmission_count,
      iban_last_four: app.iban_last_four,
      iban_format_valid: app.iban_format_valid,
      agreement_version: agreementVersion
        ? {
            version_identifier: agreementVersion.version_identifier,
            effective_date: agreementVersion.effective_date,
          }
        : null,
      creator_profile: profile
        ? {
            id: profile.id,
            display_name: profile.display_name,
            username: profile.username,
            category: profile.category,
            content_format_tags: profile.content_format_tags,
            bio: profile.bio,
            status: profile.status,
            created_at: profile.created_at,
          }
        : null,
      creator_email: user?.email ?? null,
      membership_plans: membershipPlans.map((p) => ({
        id: p.id,
        name: p.name,
        price_monthly_try: p.price_monthly_try,
        price_annual_try: p.price_annual_try,
        tier_rank: p.tier_rank,
        status: p.status,
      })),
    };
  }

  async approveApplication(applicationId: string, adminUserId: string) {
    const { app, profile } = await this.loadApplicationAndProfile(applicationId);

    if (app.decision !== CreatorApplicationDecision.Pending) {
      throw new ConflictException('APPLICATION_ALREADY_REVIEWED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(CreatorApplication, { id: app.id }, {
        decision: CreatorApplicationDecision.Approved,
        reviewed_at: now,
        reviewed_by_admin_id: adminUserId,
      });

      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.Approved,
        approved_at: now,
      });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: null,
          target_type: ModerationTargetType.CreatorProfile,
          target_id: profile.id,
          action_type: ModerationActionType.ApproveCreator,
          admin_note: null,
        }),
      );
    });

    const approvedUser = await this.userRepository.findOne({ where: { id: profile.user_id } });
    if (approvedUser?.email) {
      try {
        await this.emailService.sendMail(
          approvedUser.email,
          'Başvurunuz Onaylandı — lalabits.art',
          `<p>Merhaba ${profile.display_name},</p><p>Yaratıcı başvurunuz onaylandı. Artık kontrol panelinize erişebilirsiniz.</p>`,
        );
      } catch {
        // Intentionally swallowed — email is best-effort
      }
    }

    await this.notificationService.createNotification({
      recipientUserId: profile.user_id,
      type: NotificationType.CreatorApplicationApproved,
      title: 'Başvurunuz onaylandı',
      body: 'Tebrikler! Yaratıcı başvurunuz onaylandı. Kontrol panelinize erişebilirsiniz.',
      actionUrl: '/dashboard',
    });

    return {
      application_id: app.id,
      decision: CreatorApplicationDecision.Approved,
      reviewed_at: now,
      creator_profile_status: CreatorProfileStatus.Approved,
    };
  }

  async rejectApplication(
    applicationId: string,
    adminUserId: string,
    dto: RejectApplicationDto,
  ) {
    if (!dto.rejection_reason?.trim()) {
      throw new UnprocessableEntityException('REJECTION_REASON_REQUIRED');
    }

    const { app, profile } = await this.loadApplicationAndProfile(applicationId);

    if (app.decision !== CreatorApplicationDecision.Pending) {
      throw new ConflictException('APPLICATION_ALREADY_REVIEWED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(CreatorApplication, { id: app.id }, {
        decision: CreatorApplicationDecision.Rejected,
        reviewed_at: now,
        reviewed_by_admin_id: adminUserId,
        rejection_reason: dto.rejection_reason,
      });

      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.Rejected,
      });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: null,
          target_type: ModerationTargetType.CreatorProfile,
          target_id: profile.id,
          action_type: ModerationActionType.RejectCreator,
          admin_note: null,
        }),
      );
    });

    const rejectedUser = await this.userRepository.findOne({ where: { id: profile.user_id } });
    if (rejectedUser?.email) {
      try {
        await this.emailService.sendMail(
          rejectedUser.email,
          'Başvurunuz Hakkında Bilgilendirme — lalabits.art',
          `<p>Merhaba ${profile.display_name},</p><p>Başvurunuz bu aşamada onaylanamadı.</p><p><strong>Gerekçe:</strong> ${dto.rejection_reason}</p>`,
        );
      } catch {
        // Intentionally swallowed — email is best-effort
      }
    }

    await this.notificationService.createNotification({
      recipientUserId: profile.user_id,
      type: NotificationType.CreatorApplicationRejected,
      title: 'Başvurunuz değerlendirildi',
      body: `Başvurunuz bu aşamada onaylanamadı. Gerekçe: ${dto.rejection_reason}`,
      actionUrl: '/onboarding/status',
    });

    return {
      application_id: app.id,
      decision: CreatorApplicationDecision.Rejected,
      reviewed_at: now,
      rejection_reason: dto.rejection_reason,
      creator_profile_status: CreatorProfileStatus.Rejected,
    };
  }

  async suspendCreator(
    applicationId: string,
    adminUserId: string,
    dto: SuspendCreatorDto,
  ) {
    const { app, profile } = await this.loadApplicationAndProfile(applicationId);

    if (profile.status === CreatorProfileStatus.Suspended) {
      throw new ConflictException('PROFILE_ALREADY_SUSPENDED');
    }

    if (
      app.decision !== CreatorApplicationDecision.Approved ||
      profile.status !== CreatorProfileStatus.Approved
    ) {
      throw new UnprocessableEntityException('INVALID_PROFILE_STATUS');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.Suspended,
        suspended_at: now,
      });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: null,
          target_type: ModerationTargetType.CreatorProfile,
          target_id: profile.id,
          action_type: ModerationActionType.SuspendCreator,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    const suspendedUser = await this.userRepository.findOne({ where: { id: profile.user_id } });
    if (suspendedUser?.email) {
      try {
        await this.emailService.sendMail(
          suspendedUser.email,
          'Hesabınız Askıya Alındı — lalabits.art',
          `<p>Merhaba ${profile.display_name},</p><p>Yaratıcı hesabınız askıya alınmıştır. Sorularınız için destek ekibiyle iletişime geçebilirsiniz.</p>`,
        );
      } catch {
        // Intentionally swallowed — email is best-effort
      }
    }

    return {
      creator_profile_id: profile.id,
      creator_profile_status: CreatorProfileStatus.Suspended,
      suspended_at: now,
    };
  }

  // ── Creator Management ────────────────────────────────────────────────────

  async listCreators(
    status?: CreatorProfileStatus,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;

    const qb = this.profileRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.user', 'u')
      .leftJoin(
        (sub) =>
          sub
            .select('app.creator_profile_id', 'creator_profile_id')
            .addSelect('app.decision', 'decision')
            .from('creator_applications', 'app')
            .where(
              'app.id = (SELECT id FROM creator_applications WHERE creator_profile_id = app.creator_profile_id ORDER BY submitted_at DESC LIMIT 1)',
            ),
        'latest_app',
        'latest_app.creator_profile_id = p.id',
      )
      .addSelect('latest_app.decision', 'latest_app_decision')
      .orderBy('p.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (status) {
      qb.where('p.status = :status', { status });
    }

    const [profiles, total] = await qb.getManyAndCount();

    // Subscriber counts in bulk
    const profileIds = profiles.map((p) => p.id);
    const subCounts = profileIds.length > 0
      ? await this.subscriptionRepository
          .createQueryBuilder('s')
          .select('s.creator_profile_id', 'creator_profile_id')
          .addSelect('COUNT(*)', 'count')
          .where('s.creator_profile_id IN (:...ids)', { ids: profileIds })
          .andWhere('s.status = :status', { status: MembershipSubscriptionStatus.Active })
          .groupBy('s.creator_profile_id')
          .getRawMany<{ creator_profile_id: string; count: string }>()
      : [];

    const subCountMap = new Map(subCounts.map((r) => [r.creator_profile_id, parseInt(r.count, 10)]));

    const items = profiles.map((p) => ({
      id: p.id,
      display_name: p.display_name,
      username: p.username,
      email: p.user?.email ?? null,
      category: p.category,
      status: p.status,
      created_at: p.created_at,
      approved_at: p.approved_at,
      suspended_at: p.suspended_at,
      active_subscriber_count: subCountMap.get(p.id) ?? 0,
    }));

    return { items, total, page, limit };
  }

  async getCreatorDetail(profileId: string) {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('CREATOR_NOT_FOUND');
    }

    // Latest application
    const latestApp = await this.dataSource
      .createQueryBuilder()
      .select(['a.id', 'a.decision', 'a.submitted_at', 'a.reviewed_at', 'a.rejection_reason', 'a.resubmission_count'])
      .from('creator_applications', 'a')
      .where('a.creator_profile_id = :profileId', { profileId })
      .orderBy('a.submitted_at', 'DESC')
      .limit(1)
      .getRawOne<{
        a_id: string;
        a_decision: string;
        a_submitted_at: Date;
        a_reviewed_at: Date | null;
        a_rejection_reason: string | null;
        a_resubmission_count: number;
      }>();

    // Stats
    const [activeSubCount, postCount, productCount, collectionCount] = await Promise.all([
      this.subscriptionRepository.count({
        where: {
          creator_profile_id: profileId,
          status: MembershipSubscriptionStatus.Active,
        },
      }),
      this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('posts', 'p')
        .where('p.creator_profile_id = :profileId', { profileId })
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0', 10)),
      this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('products', 'p')
        .where('p.creator_profile_id = :profileId', { profileId })
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0', 10)),
      this.dataSource
        .createQueryBuilder()
        .select('COUNT(*)', 'count')
        .from('collections', 'c')
        .where('c.creator_profile_id = :profileId', { profileId })
        .getRawOne<{ count: string }>()
        .then((r) => parseInt(r?.count ?? '0', 10)),
    ]);

    // Recent moderation history (last 10)
    const recentActions = await this.moderationActionRepository.find({
      where: { target_id: profileId, target_type: ModerationTargetType.CreatorProfile },
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      id: profile.id,
      display_name: profile.display_name,
      username: profile.username,
      email: profile.user?.email ?? null,
      bio: profile.bio,
      category: profile.category,
      avatar_url: profile.avatar_url,
      status: profile.status,
      created_at: profile.created_at,
      approved_at: profile.approved_at,
      suspended_at: profile.suspended_at,
      latest_application: latestApp
        ? {
            id: latestApp.a_id,
            decision: latestApp.a_decision,
            submitted_at: latestApp.a_submitted_at,
            reviewed_at: latestApp.a_reviewed_at,
            rejection_reason: latestApp.a_rejection_reason,
            resubmission_count: latestApp.a_resubmission_count,
          }
        : null,
      stats: {
        active_subscriber_count: activeSubCount,
        total_posts: postCount,
        total_products: productCount,
        total_collections: collectionCount,
      },
      moderation_history: recentActions.map((a) => ({
        id: a.id,
        action_type: a.action_type,
        admin_user_id: a.admin_user_id,
        created_at: a.created_at,
      })),
    };
  }

  async suspendCreatorByProfileId(
    profileId: string,
    adminUserId: string,
    dto: SuspendCreatorDto,
  ) {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new NotFoundException('CREATOR_NOT_FOUND');
    }

    if (profile.status === CreatorProfileStatus.Suspended) {
      throw new ConflictException('PROFILE_ALREADY_SUSPENDED');
    }

    if (profile.status !== CreatorProfileStatus.Approved) {
      throw new UnprocessableEntityException('INVALID_PROFILE_STATUS');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.Suspended,
        suspended_at: now,
      });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: null,
          target_type: ModerationTargetType.CreatorProfile,
          target_id: profile.id,
          action_type: ModerationActionType.SuspendCreator,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    return {
      creator_profile_id: profile.id,
      creator_profile_status: CreatorProfileStatus.Suspended,
      suspended_at: now,
    };
  }

  async unsuspendCreator(
    profileId: string,
    adminUserId: string,
    dto: SuspendCreatorDto,
  ) {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new NotFoundException('CREATOR_NOT_FOUND');
    }

    if (profile.status !== CreatorProfileStatus.Suspended) {
      throw new ConflictException('PROFILE_NOT_SUSPENDED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(CreatorProfile, { id: profile.id }, {
        status: CreatorProfileStatus.Approved,
        suspended_at: null,
      });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: null,
          target_type: ModerationTargetType.CreatorProfile,
          target_id: profile.id,
          action_type: ModerationActionType.UnsuspendCreator,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    return {
      creator_profile_id: profile.id,
      creator_profile_status: CreatorProfileStatus.Approved,
      unsuspended_at: now,
    };
  }

  // ── Report Queue ──────────────────────────────────────────────────────────

  async listReports(
    status: ReportStatus = ReportStatus.Open,
    targetType?: ReportTargetType,
    page: number = 1,
    limit: number = 20,
  ) {
    const offset = (page - 1) * limit;

    const qb = this.reportRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.reporter_user', 'reporter')
      .where('r.status = :status', { status })
      .orderBy('r.created_at', 'ASC')
      .skip(offset)
      .take(limit);

    if (targetType) {
      qb.andWhere('r.target_type = :targetType', { targetType });
    }

    const [reports, total] = await qb.getManyAndCount();

    const items = reports.map((r) => ({
      id: r.id,
      target_type: r.target_type,
      target_id: r.target_id,
      reason_code: r.reason_code,
      status: r.status,
      reporter_email: r.reporter_user?.email ?? null,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));

    return { items, total, page, limit };
  }

  async getReport(reportId: string) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
      relations: ['reporter_user'],
    });

    if (!report) throw new NotFoundException('REPORT_NOT_FOUND');

    const targetSnapshot = await this.resolveTargetSnapshot(
      report.target_type,
      report.target_id,
    );

    const actions = await this.moderationActionRepository.find({
      where: { report_id: reportId },
      order: { created_at: 'ASC' },
    });

    return {
      id: report.id,
      target_type: report.target_type,
      target_id: report.target_id,
      reason_code: report.reason_code,
      details: report.details,
      status: report.status,
      reporter_email: report.reporter_user?.email ?? null,
      created_at: report.created_at,
      updated_at: report.updated_at,
      target_snapshot: targetSnapshot,
      moderation_actions: actions.map((a) => ({
        id: a.id,
        action_type: a.action_type,
        admin_user_id: a.admin_user_id,
        created_at: a.created_at,
      })),
    };
  }

  async removeContent(reportId: string, adminUserId: string, dto: ModerationDecisionDto) {
    const report = await this.reportRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('REPORT_NOT_FOUND');

    if (
      report.status === ReportStatus.Actioned ||
      report.status === ReportStatus.Dismissed
    ) {
      throw new ConflictException('REPORT_ALREADY_ACTIONED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Report, { id: reportId }, { status: ReportStatus.Actioned });

      await this.applyRemovedStatus(manager, report.target_type, report.target_id, now);

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: reportId,
          target_type: report.target_type as unknown as ModerationTargetType,
          target_id: report.target_id,
          action_type: ModerationActionType.RemoveContent,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    // Notify content owner (best-effort, outside transaction)
    const ownerUserId = await this.resolveContentOwnerUserId(report.target_type, report.target_id);
    if (ownerUserId) {
      await this.notificationService.createNotification({
        recipientUserId: ownerUserId,
        type: NotificationType.ContentRemoved,
        title: 'İçeriğiniz kaldırıldı',
        body: 'Bir içeriğiniz platform kurallarına aykırı olduğu için kaldırıldı.',
        actionUrl: null,
      });
    }

    return {
      report_id: reportId,
      report_status: ReportStatus.Actioned,
      target_type: report.target_type,
      target_id: report.target_id,
      content_moderation_status: 'removed',
      actioned_at: now,
    };
  }

  async dismissReport(reportId: string, adminUserId: string, dto: ModerationDecisionDto) {
    const report = await this.reportRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('REPORT_NOT_FOUND');

    if (
      report.status === ReportStatus.Actioned ||
      report.status === ReportStatus.Dismissed
    ) {
      throw new ConflictException('REPORT_ALREADY_ACTIONED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await manager.update(Report, { id: reportId }, { status: ReportStatus.Dismissed });

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: reportId,
          target_type: report.target_type as unknown as ModerationTargetType,
          target_id: report.target_id,
          action_type: ModerationActionType.DismissReport,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    return {
      report_id: reportId,
      report_status: ReportStatus.Dismissed,
      target_type: report.target_type,
      target_id: report.target_id,
      dismissed_at: now,
    };
  }

  async restoreContent(reportId: string, adminUserId: string, dto: ModerationDecisionDto) {
    const report = await this.reportRepository.findOne({ where: { id: reportId } });
    if (!report) throw new NotFoundException('REPORT_NOT_FOUND');

    // Verify content is currently removed (LD-3 state machine: only removed → clean)
    const isRemoved = await this.isContentRemoved(report.target_type, report.target_id);
    if (!isRemoved) {
      throw new ConflictException('CONTENT_NOT_REMOVED');
    }

    const now = new Date();

    await this.dataSource.transaction(async (manager) => {
      await this.applyCleanStatus(manager, report.target_type, report.target_id);

      await manager.save(
        manager.create(ModerationAction, {
          admin_user_id: adminUserId,
          report_id: reportId,
          target_type: report.target_type as unknown as ModerationTargetType,
          target_id: report.target_id,
          action_type: ModerationActionType.RestoreContent,
          admin_note: dto.admin_note ?? null,
        }),
      );
    });

    return {
      report_id: reportId,
      target_type: report.target_type,
      target_id: report.target_id,
      content_moderation_status: 'clean',
      restored_at: now,
    };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async loadApplicationAndProfile(applicationId: string) {
    const app = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });

    if (!app) {
      throw new NotFoundException('APPLICATION_NOT_FOUND');
    }

    const profile = await this.profileRepository.findOne({
      where: { id: app.creator_profile_id },
    });

    if (!profile) {
      throw new NotFoundException('APPLICATION_NOT_FOUND');
    }

    return { app, profile };
  }

  private async resolveTargetSnapshot(
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<object | null> {
    switch (targetType) {
      case ReportTargetType.Post: {
        const post = await this.postRepository.findOne({ where: { id: targetId } });
        if (!post) return null;
        return {
          title: post.title,
          publish_status: post.publish_status,
          moderation_status: post.moderation_status,
          creator_profile_id: post.creator_profile_id,
        };
      }
      case ReportTargetType.Product: {
        const product = await this.productRepository.findOne({ where: { id: targetId } });
        if (!product) return null;
        return {
          title: product.title,
          publish_status: product.publish_status,
          moderation_status: product.moderation_status,
          creator_profile_id: product.creator_profile_id,
        };
      }
      case ReportTargetType.Collection: {
        const collection = await this.collectionRepository.findOne({ where: { id: targetId } });
        if (!collection) return null;
        return {
          title: collection.title,
          publish_status: collection.publish_status,
          moderation_status: collection.moderation_status,
          creator_profile_id: collection.creator_profile_id,
        };
      }
      case ReportTargetType.User: {
        const user = await this.userRepository.findOne({ where: { id: targetId } });
        if (!user) return null;
        return { email: user.email };
      }
      case ReportTargetType.CreatorProfile: {
        const profile = await this.profileRepository.findOne({ where: { id: targetId } });
        if (!profile) return null;
        return {
          display_name: profile.display_name,
          username: profile.username,
          status: profile.status,
        };
      }
      default:
        return null;
    }
  }

  private async applyRemovedStatus(
    manager: any,
    targetType: ReportTargetType,
    targetId: string,
    now: Date,
  ): Promise<void> {
    switch (targetType) {
      case ReportTargetType.Post:
        await manager.update(Post, { id: targetId }, {
          moderation_status: PostModerationStatus.Removed,
          removed_at: now,
        });
        break;
      case ReportTargetType.Product:
        await manager.update(Product, { id: targetId }, {
          moderation_status: ProductModerationStatus.Removed,
          removed_at: now,
        });
        break;
      case ReportTargetType.Collection:
        await manager.update(Collection, { id: targetId }, {
          moderation_status: CollectionModerationStatus.Removed,
          removed_at: now,
        });
        break;
      // User and CreatorProfile targets: content removal not applicable
      // (use suspendCreator for creator_profile; user restriction is a separate flow)
      default:
        break;
    }
  }

  private async applyCleanStatus(
    manager: any,
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<void> {
    switch (targetType) {
      case ReportTargetType.Post:
        await manager.update(Post, { id: targetId }, {
          moderation_status: PostModerationStatus.Clean,
          removed_at: null,
          flagged_at: null,
        });
        break;
      case ReportTargetType.Product:
        await manager.update(Product, { id: targetId }, {
          moderation_status: ProductModerationStatus.Clean,
          removed_at: null,
          flagged_at: null,
        });
        break;
      case ReportTargetType.Collection:
        await manager.update(Collection, { id: targetId }, {
          moderation_status: CollectionModerationStatus.Clean,
          removed_at: null,
          flagged_at: null,
        });
        break;
      default:
        break;
    }
  }

  private async resolveContentOwnerUserId(
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<string | null> {
    let creatorProfileId: string | null = null;

    switch (targetType) {
      case ReportTargetType.Post: {
        const post = await this.postRepository.findOne({ where: { id: targetId }, select: ['creator_profile_id'] });
        creatorProfileId = post?.creator_profile_id ?? null;
        break;
      }
      case ReportTargetType.Product: {
        const product = await this.productRepository.findOne({ where: { id: targetId }, select: ['creator_profile_id'] });
        creatorProfileId = product?.creator_profile_id ?? null;
        break;
      }
      case ReportTargetType.Collection: {
        const collection = await this.collectionRepository.findOne({ where: { id: targetId }, select: ['creator_profile_id'] });
        creatorProfileId = collection?.creator_profile_id ?? null;
        break;
      }
      default:
        return null;
    }

    if (!creatorProfileId) return null;
    const profile = await this.profileRepository.findOne({ where: { id: creatorProfileId }, select: ['user_id'] });
    return profile?.user_id ?? null;
  }

  private async isContentRemoved(
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<boolean> {
    switch (targetType) {
      case ReportTargetType.Post: {
        const post = await this.postRepository.findOne({ where: { id: targetId } });
        return post?.moderation_status === PostModerationStatus.Removed;
      }
      case ReportTargetType.Product: {
        const product = await this.productRepository.findOne({ where: { id: targetId } });
        return product?.moderation_status === ProductModerationStatus.Removed;
      }
      case ReportTargetType.Collection: {
        const collection = await this.collectionRepository.findOne({ where: { id: targetId } });
        return collection?.moderation_status === CollectionModerationStatus.Removed;
      }
      default:
        // User / CreatorProfile targets: no content_moderation_status — not restorable via this endpoint
        throw new ConflictException('CONTENT_NOT_REMOVED');
    }
  }
}
