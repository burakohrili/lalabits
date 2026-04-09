import { IsString } from 'class-validator';

export class UpdatePayoutDto {
  @IsString()
  iban: string;
}
