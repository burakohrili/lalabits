import { IsArray, IsUUID } from 'class-validator';

export class ReorderCollectionItemsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  item_ids: string[];
}
