import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ModerationDecisionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  admin_note?: string;
}
