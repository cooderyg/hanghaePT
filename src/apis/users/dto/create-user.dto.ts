import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;

  @IsString()
  profileImgUrl: string;
}
