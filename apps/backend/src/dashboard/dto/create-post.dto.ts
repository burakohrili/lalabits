import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsObject,
  MaxLength,
  IsUUID,
  ValidateIf,
  IsArray,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostAccessLevel } from '../../content/entities/post.entity';

export class PostLinkDto {
  @IsUrl({ require_protocol: true })
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsObject()
  content?: {
    type: 'plain' | 'checklist';
    body?: string;
    items?: string[];
    links?: Array<{ url: string; title?: string }>;
  } | null;

  @IsIn([PostAccessLevel.Public, PostAccessLevel.MemberOnly, PostAccessLevel.TierGated])
  access_level: PostAccessLevel;

  // LD-3: whitelisted always; format-validated only when tier_gated
  // Business rule (required when tier_gated, null otherwise) enforced in service
  @IsOptional()
  @ValidateIf((o) => o.access_level === PostAccessLevel.TierGated && o.required_tier_id != null)
  @IsUUID()
  required_tier_id?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PostLinkDto)
  links?: PostLinkDto[];
}
