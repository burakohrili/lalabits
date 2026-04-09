import { IsEnum, IsOptional, IsArray, IsString, MaxLength, ArrayMaxSize } from 'class-validator';
import { CreatorCategory } from '../../creator/entities/creator-profile.entity';

export class UpdateCategoryDto {
  @IsEnum(CreatorCategory)
  category: CreatorCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  @ArrayMaxSize(10)
  content_format_tags?: string[];
}
