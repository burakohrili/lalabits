import { IsString, IsNotEmpty, IsOptional, IsIn, IsObject, MaxLength, IsUUID, ValidateIf } from 'class-validator';
import { PostAccessLevel } from '../../content/entities/post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsObject()
  content?: { type: 'plain'; body: string } | null;

  @IsIn([PostAccessLevel.Public, PostAccessLevel.MemberOnly, PostAccessLevel.TierGated])
  access_level: PostAccessLevel;

  // LD-3: whitelisted always; format-validated only when tier_gated
  // Business rule (required when tier_gated, null otherwise) enforced in service
  @IsOptional()
  @ValidateIf((o) => o.access_level === PostAccessLevel.TierGated && o.required_tier_id != null)
  @IsUUID()
  required_tier_id?: string | null;
}
