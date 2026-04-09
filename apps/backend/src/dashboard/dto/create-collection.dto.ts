import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  IsUUID,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { CollectionAccessType } from '../../content/entities/collection.entity';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsIn([CollectionAccessType.Purchase, CollectionAccessType.TierGated])
  access_type: CollectionAccessType;

  @ValidateIf((o: CreateCollectionDto) => o.access_type === CollectionAccessType.Purchase)
  @IsInt()
  @Min(1)
  price_try?: number;

  @ValidateIf((o: CreateCollectionDto) => o.access_type === CollectionAccessType.TierGated)
  @IsUUID()
  required_tier_id?: string;
}
