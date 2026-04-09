import { IsString, IsOptional, IsIn, IsObject, MaxLength, IsUUID } from 'class-validator';
import { PostAccessLevel } from '../../content/entities/post.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsObject()
  content?: { type: 'plain'; body: string } | null;

  @IsOptional()
  @IsIn([PostAccessLevel.Public, PostAccessLevel.MemberOnly, PostAccessLevel.TierGated])
  access_level?: PostAccessLevel;

  // LD-3: pass null to clear, pass UUID to set; service enforces the rule
  @IsOptional()
  @IsUUID()
  required_tier_id?: string | null;
}
