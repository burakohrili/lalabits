import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ReportReasonCode } from '../../moderation/dto/submit-report.dto';

export class ReportMessageDto {
  @IsEnum(ReportReasonCode)
  reason_code: ReportReasonCode;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}
