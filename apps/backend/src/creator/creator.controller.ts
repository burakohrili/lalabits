import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreatorCategory } from './entities/creator-profile.entity';

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
}
