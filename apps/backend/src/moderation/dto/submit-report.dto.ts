import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ReportTargetType } from '../entities/report.entity';

export enum ReportReasonCode {
  Spam = 'spam',
  IllegalContent = 'illegal_content',
  Copyright = 'copyright',
  Harassment = 'harassment',
  Misinformation = 'misinformation',
  Other = 'other',
}

export class SubmitReportDto {
  @IsEnum(ReportTargetType)
  target_type: ReportTargetType;

  @IsUUID()
  target_id: string;

  @IsEnum(ReportReasonCode)
  reason_code: ReportReasonCode;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}
