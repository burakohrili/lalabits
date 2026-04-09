import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterFanDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  display_name: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
}
