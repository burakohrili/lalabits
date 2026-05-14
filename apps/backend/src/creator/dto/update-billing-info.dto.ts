import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class UpdateBillingInfoDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  legal_full_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(11)
  tc_identity_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  tax_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  phone_number?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  full_address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  postal_code?: string;

  @IsIn(['individual', 'sole_trader', 'company'])
  @IsOptional()
  entity_type?: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  company_name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(34)
  iban?: string;
}
