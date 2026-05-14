import { IsUUID, IsIn, IsOptional, IsISO8601, IsString } from 'class-validator';
import { BillingInterval } from '../../billing/entities/membership-subscription.entity';

export class SubscribeDto {
  @IsUUID()
  plan_id: string;

  @IsIn([BillingInterval.Monthly])
  billing_interval: BillingInterval;

  @IsString()
  @IsOptional()
  consent_version?: string;

  @IsISO8601()
  @IsOptional()
  consented_at?: string;
}
