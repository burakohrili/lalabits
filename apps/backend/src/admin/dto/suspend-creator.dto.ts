import { IsOptional, IsString } from 'class-validator';

export class SuspendCreatorDto {
  @IsOptional()
  @IsString()
  admin_note?: string;
}
