import { IsString, IsEmail, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { KvkkRequestType } from '../entities/kvkk-request.entity';

export class CreateKvkkRequestDto {
  @IsString()
  @MaxLength(200)
  full_name: string;

  @IsEmail()
  @MaxLength(300)
  email: string;

  @IsEnum(KvkkRequestType)
  request_type: KvkkRequestType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  details?: string;
}
