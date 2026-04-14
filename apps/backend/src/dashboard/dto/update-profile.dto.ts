import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDashboardProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  display_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string | null;

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
