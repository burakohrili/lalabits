import { IsString, IsOptional, IsInt, Min, MaxLength } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string | null;

  @IsInt()
  @Min(1)
  price_monthly_try: number;

  @IsInt()
  @Min(1)
  tier_rank: number;
}
