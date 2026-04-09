import { IsBoolean } from 'class-validator';

export class SubmitApplicationDto {
  @IsBoolean()
  agree_creator_terms: boolean;
}
