import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class UpsertFanBillingProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  legal_full_name?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  tax_number?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  billing_address?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  postal_code?: string | null;

  @IsEmail()
  @IsOptional()
  @MaxLength(200)
  billing_email?: string | null;
}
