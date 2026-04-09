import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  // ── PRODUCTS ─────────────────────────────────────────────────────────────

  @Get('products')
  @HttpCode(HttpStatus.OK)
  listProducts(@CurrentUser() user: AuthenticatedUser) {
    return this.libraryService.listPurchasedProducts(user.id);
  }

  @Get('products/:id/download')
  @HttpCode(HttpStatus.OK)
  downloadProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productId: string,
  ) {
    return this.libraryService.getProductDownloadUrl(user.id, productId);
  }

  // ── COLLECTIONS ───────────────────────────────────────────────────────────

  @Get('collections')
  @HttpCode(HttpStatus.OK)
  listCollections(@CurrentUser() user: AuthenticatedUser) {
    return this.libraryService.listPurchasedCollections(user.id);
  }

  @Get('collections/:id')
  @HttpCode(HttpStatus.OK)
  getCollectionDetail(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
  ) {
    return this.libraryService.getCollectionDetail(user.id, collectionId);
  }

  @Get('collections/:id/items/:itemId/download')
  @HttpCode(HttpStatus.OK)
  downloadCollectionItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') collectionId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.libraryService.getCollectionItemDownloadUrl(
      user.id,
      collectionId,
      itemId,
    );
  }
}
