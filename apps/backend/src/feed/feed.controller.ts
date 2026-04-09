import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { FeedService } from './feed.service';

@Controller()
@UseGuards(OptionalJwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

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
}
