import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { KvkkRequestStatus } from '../entities/kvkk-request.entity';

export class UpdateKvkkStatusDto {
  @IsEnum(KvkkRequestStatus)
  status: KvkkRequestStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  admin_notes?: string;
}
