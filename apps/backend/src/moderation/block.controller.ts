import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { BlockService } from './block.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('users/:id/block')
  @HttpCode(HttpStatus.OK)
  blockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') targetId: string,
  ) {
    return this.blockService.blockUser(user.id, targetId);
  }

  @Delete('users/:id/block')
  @HttpCode(HttpStatus.OK)
  unblockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') targetId: string,
  ) {
    return this.blockService.unblockUser(user.id, targetId);
  }

  @Get('settings/blocked')
  listBlocked(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blockService.listBlocked(
      user.id,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }
}
