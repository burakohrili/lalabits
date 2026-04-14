import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaymentDisputeStatus } from '../entities/payment-dispute.entity';

export class UpdateDisputeDto {
  @IsEnum(PaymentDisputeStatus)
  status: PaymentDisputeStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  admin_notes?: string;
}
