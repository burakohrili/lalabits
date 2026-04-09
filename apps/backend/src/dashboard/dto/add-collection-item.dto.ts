import { IsIn, IsUUID } from 'class-validator';
import { CollectionItemType } from '../../content/entities/collection-item.entity';

export class AddCollectionItemDto {
  @IsIn([CollectionItemType.Post, CollectionItemType.Product])
  item_type: CollectionItemType;

  @IsUUID()
  item_id: string;
}
