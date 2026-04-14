import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { KvkkService } from './kvkk.service';
import { CreateKvkkRequestDto } from './dto/create-kvkk-request.dto';
import { UpdateKvkkStatusDto } from './dto/update-kvkk-status.dto';
import { KvkkRequestStatus } from './entities/kvkk-request.entity';

// ── Public endpoint ───────────────────────────────────────────────────────

@Controller('kvkk')
export class KvkkController {
  constructor(private readonly kvkkService: KvkkService) {}

  @Post('request')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createRequest(
    @Body() dto: CreateKvkkRequestDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.kvkkService.createRequest(dto, user?.id);
  }
}

// ── Admin endpoints ───────────────────────────────────────────────────────

@Controller('admin/kvkk')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminKvkkController {
  constructor(private readonly kvkkService: KvkkService) {}

  @Get()
  adminList(
    @Query('status') status?: KvkkRequestStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.kvkkService.adminList(status, page, limit);
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateKvkkStatusDto,
  ) {
    return this.kvkkService.updateStatus(id, dto);
  }
}
