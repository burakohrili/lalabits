import { IsString, IsOptional, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateDisputeDto {
  @IsOptional()
  @IsUUID()
  invoice_id?: string;

  @IsOptional()
  @IsUUID()
  subscription_id?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  reason: string;
}
