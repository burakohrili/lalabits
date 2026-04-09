import { IsString, MinLength } from 'class-validator';

export class RejectApplicationDto {
  @IsString()
  @MinLength(1)
  rejection_reason: string;
}
