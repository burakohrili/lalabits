import { IsString, IsOptional, MaxLength, IsIn, Matches } from 'class-validator';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class UpdateProfileDto {
  @IsString()
  @MaxLength(100)
  display_name: string;

  @IsString()
  @Matches(/^[a-z0-9][a-z0-9_-]{2,29}$/)
  username: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string | null;

  @IsOptional()
  @IsString()
  avatar_filename?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_IMAGE_TYPES)
  avatar_content_type?: string | null;

  @IsOptional()
  @IsString()
  cover_image_filename?: string | null;

  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_IMAGE_TYPES)
  cover_image_content_type?: string | null;
}
