import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ViolationSeverity, ViolationStatus, ViolationTargetType, ViolationType } from '../../moderation/entities/content-policy-violation.entity';

export class CreateContentViolationDto {
  @IsEnum(ViolationTargetType)
  target_type: ViolationTargetType;

  @IsUUID()
  target_id: string;

  @IsUUID()
  creator_id: string;

  @IsEnum(ViolationType)
  violation_type: ViolationType;

  @IsEnum(ViolationSeverity)
  @IsOptional()
  severity?: ViolationSeverity;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateContentViolationDto {
  @IsEnum(ViolationStatus)
  status: ViolationStatus;

  @IsEnum(ViolationSeverity)
  @IsOptional()
  severity?: ViolationSeverity;

  @IsString()
  @IsOptional()
  notes?: string;
}
