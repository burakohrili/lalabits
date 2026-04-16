import {
  IsString,
  IsOptional,
  IsIn,
  IsObject,
  MaxLength,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostAccessLevel } from '../../content/entities/post.entity';
import { PostLinkDto } from './create-post.dto';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsObject()
  content?: {
    type: 'plain' | 'checklist';
    body?: string;
    items?: string[];
    links?: Array<{ url: string; title?: string }>;
  } | null;

  @IsOptional()
  @IsIn([PostAccessLevel.Public, PostAccessLevel.MemberOnly, PostAccessLevel.TierGated])
  access_level?: PostAccessLevel;

  // LD-3: pass null to clear, pass UUID to set; service enforces the rule
  @IsOptional()
  @IsUUID()
  required_tier_id?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostLinkDto)
  links?: PostLinkDto[];
}
