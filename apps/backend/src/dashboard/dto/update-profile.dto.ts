import { IsOptional, IsString, MaxLength, MinLength, Matches, IsEnum } from 'class-validator';
import { CreatorCategory } from '../../creator/entities/creator-profile.entity';

export class UpdateDashboardProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  display_name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9_-]{2,29}$/)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @IsOptional()
  @IsEnum(CreatorCategory)
  category?: CreatorCategory;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  avatar_filename?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  avatar_content_type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  cover_image_filename?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  cover_image_content_type?: string;
}
