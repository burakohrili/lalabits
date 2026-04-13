import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSocialLinksDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  youtube?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  instagram?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  twitter?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  discord?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tiktok?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;
}
