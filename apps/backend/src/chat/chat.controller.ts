import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { ChatService } from './chat.service';
import { StartConversationDto } from './dto/start-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ReportMessageDto } from './dto/report-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ── DM Conversations ──────────────────────────────────────────────────────

  @Post('conversations')
  @HttpCode(HttpStatus.OK)
  startOrGetConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StartConversationDto,
  ) {
    return this.chatService.startOrGetConversation(user.id, dto);
  }

  @Get('conversations')
  listConversations(@CurrentUser() user: AuthenticatedUser) {
    return this.chatService.listConversations(user.id);
  }

  @Get('conversations/:id/messages')
  getMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') conversationId: string,
    @Query('before_id') beforeId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getConversationMessages(
      user.id,
      conversationId,
      beforeId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(user.id, conversationId, dto);
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.markConversationRead(user.id, conversationId);
  }

  // ── Unread count ──────────────────────────────────────────────────────────

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: AuthenticatedUser) {
    return this.chatService.getUnreadCount(user.id);
  }

  // ── Community channel ─────────────────────────────────────────────────────

  @Get('community/:username/messages')
  getCommunityMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('username') username: string,
    @Query('before_id') beforeId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getCommunityMessages(
      user.id,
      username,
      beforeId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Post('community/:username/messages')
  sendCommunityMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('username') username: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendCommunityMessage(user.id, username, dto);
  }

  @Post('community/:username/read')
  @HttpCode(HttpStatus.OK)
  markCommunityRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('username') username: string,
  ) {
    return this.chatService.markCommunityRead(user.id, username);
  }

  // ── Reports ───────────────────────────────────────────────────────────────

  @Post('messages/:id/report')
  reportMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') messageId: string,
    @Body() dto: ReportMessageDto,
  ) {
    return this.chatService.reportMessage(user.id, messageId, dto);
  }

  @Post('community-messages/:id/report')
  reportCommunityMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') messageId: string,
    @Body() dto: ReportMessageDto,
  ) {
    return this.chatService.reportCommunityMessage(user.id, messageId, dto);
  }
}
