import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  price_monthly_try?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  tier_rank?: number;
}
