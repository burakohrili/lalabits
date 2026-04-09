import { IsString, MinLength, MaxLength } from 'class-validator';

export class StartConversationDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  creator_username: string;
}
