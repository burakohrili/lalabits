import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { FeedService } from './feed.service';

@Controller()
@UseGuards(OptionalJwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('feed/home')
  @UseGuards(JwtAuthGuard)
  getHomeFeed(
    @CurrentUser() viewer: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Math.max(1, parseInt(page, 10)) : 1;
    const l = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 20;
    return this.feedService.getHomeFeed(viewer.id, p, l);
  }

  @Get('feed/:username')
  async getFeed(
    @Param('username') username: string,
    @CurrentUser() viewer: AuthenticatedUser | undefined,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Math.max(1, parseInt(page, 10)) : 1;
    const l = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 20;
    return this.feedService.getFeed(username, viewer?.id, p, l);
  }

  @Get('posts/:id')
  async getPost(
    @Param('id') id: string,
    @CurrentUser() viewer: AuthenticatedUser | undefined,
  ) {
    return this.feedService.getPost(id, viewer?.id);
  }

  @Get('posts/:id/checklist-progress')
  @UseGuards(JwtAuthGuard)
  getChecklistProgress(
    @Param('id') id: string,
    @CurrentUser() viewer: AuthenticatedUser,
  ) {
    return this.feedService.getChecklistProgress(id, viewer.id);
  }

  @Put('posts/:id/checklist-progress')
  @UseGuards(JwtAuthGuard)
  updateChecklistProgress(
    @Param('id') id: string,
    @CurrentUser() viewer: AuthenticatedUser,
    @Body('checked_item_ids') checkedItemIds: string[],
  ) {
    return this.feedService.updateChecklistProgress(id, viewer.id, checkedItemIds ?? []);
  }
}
