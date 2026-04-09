import { IsUUID, IsIn } from 'class-validator';
import { BillingInterval } from '../../billing/entities/membership-subscription.entity';

export class SubscribeDto {
  @IsUUID()
  plan_id: string;

  @IsIn([BillingInterval.Monthly])
  billing_interval: BillingInterval;
}
