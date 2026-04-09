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

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsIn([CollectionAccessType.Purchase, CollectionAccessType.TierGated])
  access_type?: CollectionAccessType;

  @IsOptional()
  @IsInt()
  @Min(1)
  price_try?: number;

  @IsOptional()
  @IsUUID()
  required_tier_id?: string;
}
