import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatorApprovedGuard } from '../creator/guards/creator-approved.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { AddCollectionItemDto } from './dto/add-collection-item.dto';
import { ReorderCollectionItemsDto } from './dto/reorder-collection-items.dto';
import { PostPublishStatus } from '../content/entities/post.entity';
import { ProductPublishStatus } from '../content/entities/product.entity';
import { CollectionPublishStatus } from '../content/entities/collection.entity';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, CreatorApprovedGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // ── Overview ──────────────────────────────────────────────────────────────

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOverview(user.id);
  }

  // ── Plans ─────────────────────────────────────────────────────────────────

  @Get('plans')
  @HttpCode(HttpStatus.OK)
  listPlans(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.listPlans(user.id);
  }

  @Post('plans/:id/publish')
  @HttpCode(HttpStatus.OK)
  publishPlan(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') planId: string,
  ) {
    return this.dashboardService.publishPlan(user.id, planId);
  }

  @Post('plans/:id/hide')
  @HttpCode(HttpStatus.OK)
  hidePlan(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') planId: string,
  ) {
    return this.dashboardService.hidePlan(user.id, planId);
  }

  @Post('plans/:id/archive')
  @HttpCode(HttpStatus.OK)
  archivePlan(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') planId: string,
  ) {
    return this.dashboardService.archivePlan(user.id, planId);
  }

  // ── Posts ─────────────────────────────────────────────────────────────────

  @Get('posts')
  @HttpCode(HttpStatus.OK)
  listPosts(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: PostPublishStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.listPosts(
      user.id,
      status,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('posts/:id')
  @HttpCode(HttpStatus.OK)
  getPost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
  ) {
    return this.dashboardService.getPost(user.id, postId);
  }

  @Post('posts')
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePostDto,
  ) {
    return this.dashboardService.createPost(user.id, dto);
  }

  @Patch('posts/:id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.dashboardService.updatePost(user.id, postId, dto);
  }

  @Post('posts/:id/publish')
  @HttpCode(HttpStatus.OK)
  publishPost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
  ) {
    return this.dashboardService.publishPost(user.id, postId);
  }

  @Post('posts/:id/unpublish')
  @HttpCode(HttpStatus.OK)
  unpublishPost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
  ) {
    return this.dashboardService.unpublishPost(user.id, postId);
  }

  @Post('posts/:id/archive')
  @HttpCode(HttpStatus.OK)
  archivePost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
  ) {
    return this.dashboardService.archivePost(user.id, postId);
  }

  @Delete('posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
  ) {
    return this.dashboardService.deletePost(user.id, postId);
  }

  // ── Products ──────────────────────────────────────────────────────────────

  @Post('products/upload-url')
  @HttpCode(HttpStatus.OK)
  getProductUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body('content_type') contentType: string,
    @Body('original_filename') originalFilename: string,
  ) {
    return this.dashboardService.getProductUploadUrl(user.id, contentType, originalFilename);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  listProducts(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: ProductPublishStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.listProducts(
      user.id,
      status,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('products/:id')
  @HttpCode(HttpStatus.OK)
  getProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.dashboardService.getProduct(user.id, productId);
  }

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  createProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductDto,
  ) {
    return this.dashboardService.createProduct(user.id, dto);
  }

  @Patch('products/:id')
  @HttpCode(HttpStatus.OK)
  updateProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.dashboardService.updateProduct(user.id, productId, dto);
  }

  @Post('products/:id/publish')
  @HttpCode(HttpStatus.OK)
  publishProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.dashboardService.publishProduct(user.id, productId);
  }

  @Post('products/:id/archive')
  @HttpCode(HttpStatus.OK)
  archiveProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.dashboardService.archiveProduct(user.id, productId);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.dashboardService.deleteProduct(user.id, productId);
  }

  // ── Collections ───────────────────────────────────────────────────────────

  @Get('collections')
  @HttpCode(HttpStatus.OK)
  listCollections(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: CollectionPublishStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.dashboardService.listCollections(
      user.id,
      status,
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
  }

  @Get('collections/:id')
  @HttpCode(HttpStatus.OK)
  getCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.dashboardService.getCollection(user.id, collectionId);
  }

  @Post('collections')
  @HttpCode(HttpStatus.CREATED)
  createCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCollectionDto,
  ) {
    return this.dashboardService.createCollection(user.id, dto);
  }

  @Patch('collections/:id')
  @HttpCode(HttpStatus.OK)
  updateCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.dashboardService.updateCollection(user.id, collectionId, dto);
  }

  @Post('collections/:id/publish')
  @HttpCode(HttpStatus.OK)
  publishCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.dashboardService.publishCollection(user.id, collectionId);
  }

  @Post('collections/:id/archive')
  @HttpCode(HttpStatus.OK)
  archiveCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.dashboardService.archiveCollection(user.id, collectionId);
  }

  @Delete('collections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCollection(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.dashboardService.deleteCollection(user.id, collectionId);
  }

  @Post('collections/:id/items')
  @HttpCode(HttpStatus.CREATED)
  addCollectionItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
    @Body() dto: AddCollectionItemDto,
  ) {
    return this.dashboardService.addCollectionItem(user.id, collectionId, dto);
  }

  @Delete('collections/:id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCollectionItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.dashboardService.removeCollectionItem(user.id, collectionId, itemId);
  }

  @Post('collections/:id/items/reorder')
  @HttpCode(HttpStatus.OK)
  reorderCollectionItems(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
    @Body() dto: ReorderCollectionItemsDto,
  ) {
    return this.dashboardService.reorderCollectionItems(user.id, collectionId, dto);
  }
}
