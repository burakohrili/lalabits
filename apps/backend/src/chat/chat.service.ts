import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatReadCursor } from './entities/chat-read-cursor.entity';
import { CommunityMessage } from './entities/community-message.entity';
import { CommunityReadCursor } from './entities/community-read-cursor.entity';
import { CreatorProfile, CreatorProfileStatus } from '../creator/entities/creator-profile.entity';
import { User } from '../auth/entities/user.entity';
import {
  MembershipSubscription,
  MembershipSubscriptionStatus,
} from '../billing/entities/membership-subscription.entity';
import { Report, ReportTargetType } from '../moderation/entities/report.entity';
import { ReportReasonCode } from '../moderation/dto/submit-report.dto';
import { BlockService } from '../moderation/block.service';
import { SendMessageDto } from './dto/send-message.dto';
import { StartConversationDto } from './dto/start-conversation.dto';
import { ReportMessageDto } from './dto/report-message.dto';

const ACTIVE_SUB_STATUSES = [
  MembershipSubscriptionStatus.Active,
  MembershipSubscriptionStatus.Cancelled,
  MembershipSubscriptionStatus.GracePeriod,
];

const DEFAULT_LIMIT = 30;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatConversation)
    private readonly conversationRepo: Repository<ChatConversation>,
    @InjectRepository(ChatMessage)
    private readonly messageRepo: Repository<ChatMessage>,
    @InjectRepository(ChatReadCursor)
    private readonly readCursorRepo: Repository<ChatReadCursor>,
    @InjectRepository(CommunityMessage)
    private readonly communityMessageRepo: Repository<CommunityMessage>,
    @InjectRepository(CommunityReadCursor)
    private readonly communityReadCursorRepo: Repository<CommunityReadCursor>,
    @InjectRepository(CreatorProfile)
    private readonly creatorProfileRepo: Repository<CreatorProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MembershipSubscription)
    private readonly subscriptionRepo: Repository<MembershipSubscription>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    private readonly blockService: BlockService,
  ) {}

  // ── CONVERSATION: start or retrieve ──────────────────────────────────────

  async startOrGetConversation(userId: string, dto: StartConversationDto) {
    const profile = await this.resolveCreatorProfile(dto.creator_username);

    if (profile.user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_MESSAGE_YOURSELF');
    }

    // Check if an existing conversation exists — return it regardless of current sub state
    const existing = await this.conversationRepo.findOne({
      where: {
        creator_profile_id: profile.id,
        fan_user_id: userId,
      },
    });

    if (existing) {
      return this.formatConversation(existing, userId);
    }

    // New conversation requires strictly active subscription (not cancelled-in-period)
    const hasAccess = await this.checkStrictlyActiveSubscription(userId, profile.id);
    if (!hasAccess) {
      throw new ForbiddenException('SUBSCRIPTION_REQUIRED');
    }

    const conv = await this.conversationRepo.save(
      this.conversationRepo.create({
        creator_profile_id: profile.id,
        creator_user_id: profile.user_id,
        fan_user_id: userId,
        last_message_at: null,
      }),
    );

    return this.formatConversation(conv, userId);
  }

  // ── CONVERSATION: list ────────────────────────────────────────────────────

  async listConversations(userId: string) {
    // User appears as fan_user_id OR creator_user_id
    const conversations = await this.conversationRepo.find({
      where: [{ fan_user_id: userId }, { creator_user_id: userId }],
      order: { last_message_at: 'DESC' },
    });

    const items = await Promise.all(
      conversations.map((c) => this.formatConversation(c, userId)),
    );

    return { items };
  }

  // ── CONVERSATION: messages (cursor paginated) ─────────────────────────────

  async getConversationMessages(
    userId: string,
    conversationId: string,
    beforeId?: string,
    limit = DEFAULT_LIMIT,
  ) {
    const conv = await this.assertConversationParticipant(userId, conversationId);

    let qb = this.messageRepo
      .createQueryBuilder('m')
      .where('m.conversation_id = :conversationId', { conversationId: conv.id })
      .orderBy('m.created_at', 'DESC')
      .take(Math.min(limit, 50));

    if (beforeId) {
      const pivot = await this.messageRepo.findOne({ where: { id: beforeId } });
      if (pivot) {
        qb = qb.andWhere('m.created_at < :pivotDate', { pivotDate: pivot.created_at });
      }
    }

    const messages = await qb.getMany();
    // Return chronological order for rendering
    messages.reverse();

    return {
      conversation_id: conv.id,
      items: messages.map((m) => this.formatMessage(m, userId)),
      has_more: messages.length === Math.min(limit, 50),
    };
  }

  // ── CONVERSATION: send message ────────────────────────────────────────────

  async sendMessage(userId: string, conversationId: string, dto: SendMessageDto) {
    const conv = await this.assertConversationParticipant(userId, conversationId);

    // Check write access: fan must still have active sub (or be the creator)
    if (conv.fan_user_id === userId) {
      const hasAccess = await this.checkActiveSubscription(userId, conv.creator_profile_id);
      if (!hasAccess) {
        throw new ForbiddenException('SUBSCRIPTION_REQUIRED');
      }
    }

    // Block check: prevent sending if either party has blocked the other
    const otherUserId = conv.fan_user_id === userId ? conv.creator_user_id : conv.fan_user_id;
    if (await this.blockService.isBlocked(userId, otherUserId)) {
      throw new ForbiddenException('BLOCKED');
    }

    const message = await this.messageRepo.save(
      this.messageRepo.create({
        conversation_id: conv.id,
        sender_user_id: userId,
        body: dto.body.trim(),
      }),
    );

    // Update last_message_at for list ordering
    await this.conversationRepo.update(
      { id: conv.id },
      { last_message_at: message.created_at },
    );

    // Auto-mark read for sender
    await this.upsertReadCursor(conv.id, userId, message.created_at);

    return this.formatMessage(message, userId);
  }

  // ── CONVERSATION: mark read ───────────────────────────────────────────────

  async markConversationRead(userId: string, conversationId: string) {
    await this.assertConversationParticipant(userId, conversationId);
    await this.upsertReadCursor(conversationId, userId, new Date());
    return { ok: true };
  }

  // ── UNREAD COUNT (DM only) ────────────────────────────────────────────────

  async getUnreadCount(userId: string): Promise<{ unread_count: number }> {
    // All conversations where this user is a participant
    const convs = await this.conversationRepo.find({
      where: [{ fan_user_id: userId }, { creator_user_id: userId }],
      select: ['id'],
    });

    if (convs.length === 0) return { unread_count: 0 };

    const convIds = convs.map((c) => c.id);

    // Count messages from other senders after each conversation's cursor
    // Uses a raw query for efficiency
    const result: Array<{ cnt: string }> = await this.messageRepo.query(
      `SELECT COUNT(*) AS cnt
       FROM chat_messages m
       LEFT JOIN chat_read_cursors c
         ON c.conversation_id = m.conversation_id AND c.user_id = $1
       WHERE m.conversation_id = ANY($2)
         AND m.sender_user_id != $1
         AND (c.last_read_at IS NULL OR m.created_at > c.last_read_at)`,
      [userId, convIds],
    );

    const unread_count = parseInt(result[0]?.cnt ?? '0', 10);
    return { unread_count };
  }

  // ── COMMUNITY: messages ───────────────────────────────────────────────────

  async getCommunityMessages(
    userId: string,
    creatorUsername: string,
    beforeId?: string,
    limit = DEFAULT_LIMIT,
  ) {
    const profile = await this.resolveCreatorProfile(creatorUsername);
    await this.assertCommunityAccess(userId, profile);

    // Fetch IDs blocked by viewer to filter their messages out
    const blockedIds = await this.blockService.getBlockedIds(userId);

    let qb = this.communityMessageRepo
      .createQueryBuilder('m')
      .where('m.creator_profile_id = :profileId', { profileId: profile.id })
      .orderBy('m.created_at', 'DESC')
      .take(Math.min(limit, 50));

    if (blockedIds.length > 0) {
      qb = qb.andWhere('m.sender_user_id NOT IN (:...blockedIds)', { blockedIds });
    }

    if (beforeId) {
      const pivot = await this.communityMessageRepo.findOne({ where: { id: beforeId } });
      if (pivot) {
        qb = qb.andWhere('m.created_at < :pivotDate', { pivotDate: pivot.created_at });
      }
    }

    const messages = await qb.getMany();
    messages.reverse();

    return {
      creator_profile_id: profile.id,
      creator_username: profile.username,
      items: messages.map((m) => this.formatCommunityMessage(m, userId)),
      has_more: messages.length === Math.min(limit, 50),
    };
  }

  // ── COMMUNITY: send message ───────────────────────────────────────────────

  async sendCommunityMessage(
    userId: string,
    creatorUsername: string,
    dto: SendMessageDto,
  ) {
    const profile = await this.resolveCreatorProfile(creatorUsername);
    await this.assertCommunityAccess(userId, profile);

    const message = await this.communityMessageRepo.save(
      this.communityMessageRepo.create({
        creator_profile_id: profile.id,
        sender_user_id: userId,
        body: dto.body.trim(),
      }),
    );

    // Auto-mark read for sender
    await this.upsertCommunityReadCursor(profile.id, userId, message.created_at);

    this.logger.log(`community_message_sent profile=${profile.id} user=${userId}`);

    return this.formatCommunityMessage(message, userId);
  }

  // ── COMMUNITY: mark read ──────────────────────────────────────────────────

  async markCommunityRead(userId: string, creatorUsername: string) {
    const profile = await this.resolveCreatorProfile(creatorUsername);
    await this.assertCommunityAccess(userId, profile);
    await this.upsertCommunityReadCursor(profile.id, userId, new Date());
    return { ok: true };
  }

  // ── REPORT: DM message ────────────────────────────────────────────────────

  async reportMessage(userId: string, messageId: string, dto: ReportMessageDto) {
    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException('MESSAGE_NOT_FOUND');

    // Reporter must be a participant of the conversation
    await this.assertConversationParticipant(userId, message.conversation_id);

    if (message.sender_user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_REPORT_OWN_MESSAGE');
    }

    const report = await this.reportRepo.save(
      this.reportRepo.create({
        reporter_user_id: userId,
        target_type: ReportTargetType.ChatMessage,
        target_id: messageId,
        reason_code: dto.reason_code,
        details: dto.details ?? null,
      }),
    );

    return { id: report.id, status: report.status };
  }

  // ── REPORT: community message ─────────────────────────────────────────────

  async reportCommunityMessage(
    userId: string,
    messageId: string,
    dto: ReportMessageDto,
  ) {
    const message = await this.communityMessageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException('MESSAGE_NOT_FOUND');

    // Reporter must have access to this community
    const profile = await this.creatorProfileRepo.findOne({
      where: { id: message.creator_profile_id },
    });
    if (profile) await this.assertCommunityAccess(userId, profile);

    if (message.sender_user_id === userId) {
      throw new UnprocessableEntityException('CANNOT_REPORT_OWN_MESSAGE');
    }

    const report = await this.reportRepo.save(
      this.reportRepo.create({
        reporter_user_id: userId,
        target_type: ReportTargetType.CommunityMessage,
        target_id: messageId,
        reason_code: dto.reason_code,
        details: dto.details ?? null,
      }),
    );

    return { id: report.id, status: report.status };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async resolveCreatorProfile(username: string): Promise<CreatorProfile> {
    const profile = await this.creatorProfileRepo.findOne({ where: { username } });
    if (!profile || profile.status === CreatorProfileStatus.Suspended) {
      throw new NotFoundException('CREATOR_NOT_FOUND');
    }
    return profile;
  }

  // Strict check — only status=active qualifies (for new conversation creation)
  private async checkStrictlyActiveSubscription(
    userId: string,
    creatorProfileId: string,
  ): Promise<boolean> {
    const now = new Date();
    const sub = await this.subscriptionRepo.findOne({
      where: {
        fan_user_id: userId,
        creator_profile_id: creatorProfileId,
        status: MembershipSubscriptionStatus.Active,
      },
    });
    if (!sub) return false;
    return sub.current_period_end > now;
  }

  // Lenient check — active + cancelled-in-period + grace (for existing conv write & community)
  private async checkActiveSubscription(
    userId: string,
    creatorProfileId: string,
  ): Promise<boolean> {
    const now = new Date();
    const sub = await this.subscriptionRepo.findOne({
      where: {
        fan_user_id: userId,
        creator_profile_id: creatorProfileId,
        status: In(ACTIVE_SUB_STATUSES),
      },
    });

    if (!sub) return false;

    if (sub.status === MembershipSubscriptionStatus.GracePeriod) {
      return sub.grace_period_ends_at != null && sub.grace_period_ends_at > now;
    }

    return sub.current_period_end > now;
  }

  private async assertConversationParticipant(
    userId: string,
    conversationId: string,
  ): Promise<ChatConversation> {
    const conv = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('CONVERSATION_NOT_FOUND');
    if (conv.fan_user_id !== userId && conv.creator_user_id !== userId) {
      throw new ForbiddenException('NOT_A_PARTICIPANT');
    }
    return conv;
  }

  private async assertCommunityAccess(
    userId: string,
    profile: CreatorProfile,
  ): Promise<void> {
    // Creator always has access to their own community
    if (profile.user_id === userId) return;

    const hasAccess = await this.checkActiveSubscription(userId, profile.id);
    if (!hasAccess) {
      throw new ForbiddenException('SUBSCRIPTION_REQUIRED');
    }
  }

  private async upsertReadCursor(
    conversationId: string,
    userId: string,
    at: Date,
  ): Promise<void> {
    await this.readCursorRepo
      .createQueryBuilder()
      .insert()
      .into(ChatReadCursor)
      .values({ conversation_id: conversationId, user_id: userId, last_read_at: at })
      .orUpdate(['last_read_at'], ['conversation_id', 'user_id'])
      .execute();
  }

  private async upsertCommunityReadCursor(
    creatorProfileId: string,
    userId: string,
    at: Date,
  ): Promise<void> {
    await this.communityReadCursorRepo
      .createQueryBuilder()
      .insert()
      .into(CommunityReadCursor)
      .values({ creator_profile_id: creatorProfileId, user_id: userId, last_read_at: at })
      .orUpdate(['last_read_at'], ['creator_profile_id', 'user_id'])
      .execute();
  }

  private async formatConversation(
    conv: ChatConversation,
    userId: string,
  ) {
    const isFan = conv.fan_user_id === userId;

    // Load the other party's user display info
    const otherUserId = isFan ? conv.creator_user_id : conv.fan_user_id;
    const otherUser = await this.userRepo.findOne({
      where: { id: otherUserId },
      select: ['id', 'email'],
    });

    // Load the creator profile for username/display_name
    const otherProfile = isFan
      ? await this.creatorProfileRepo.findOne({
          where: { id: conv.creator_profile_id },
          select: ['username', 'display_name'],
        })
      : null;

    // Last message preview
    const lastMessage = await this.messageRepo.findOne({
      where: { conversation_id: conv.id },
      order: { created_at: 'DESC' },
    });

    // Unread count for this conversation
    const cursor = await this.readCursorRepo.findOne({
      where: { conversation_id: conv.id, user_id: userId },
    });

    let unread_count = 0;
    if (lastMessage && lastMessage.sender_user_id !== userId) {
      if (!cursor || lastMessage.created_at > cursor.last_read_at) {
        // Approximate: count messages after cursor from other party
        const result: Array<{ cnt: string }> = await this.messageRepo.query(
          `SELECT COUNT(*) AS cnt FROM chat_messages
           WHERE conversation_id = $1 AND sender_user_id != $2
             AND ($3::timestamptz IS NULL OR created_at > $3)`,
          [conv.id, userId, cursor?.last_read_at ?? null],
        );
        unread_count = parseInt(result[0]?.cnt ?? '0', 10);
      }
    }

    return {
      id: conv.id,
      other_party_display_name: otherProfile?.display_name ?? otherUser?.email ?? 'Kullanıcı',
      other_party_username: otherProfile?.username ?? null,
      role: isFan ? 'fan' : 'creator',
      last_message_body: lastMessage?.body ?? null,
      last_message_at: conv.last_message_at,
      unread_count,
    };
  }

  private formatMessage(message: ChatMessage, currentUserId: string) {
    return {
      id: message.id,
      body: message.body,
      sender_user_id: message.sender_user_id,
      is_own: message.sender_user_id === currentUserId,
      created_at: message.created_at,
    };
  }

  private formatCommunityMessage(message: CommunityMessage, currentUserId: string) {
    return {
      id: message.id,
      body: message.body,
      sender_user_id: message.sender_user_id,
      is_own: message.sender_user_id === currentUserId,
      created_at: message.created_at,
    };
  }
}
