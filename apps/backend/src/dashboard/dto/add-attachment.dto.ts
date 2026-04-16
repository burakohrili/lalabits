import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class AddAttachmentDto {
  @IsString()
  @IsNotEmpty()
  storage_key: string;

  @IsString()
  @IsNotEmpty()
  original_filename: string;

  @IsInt()
  @Min(0)
  file_size_bytes: number;

  @IsString()
  @IsNotEmpty()
  content_type: string;

  @IsOptional()
  @IsBoolean()
  is_downloadable?: boolean;
}
