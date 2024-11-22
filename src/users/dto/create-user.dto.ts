import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(['youth', 'mentor', 'employer'], { message: 'Valid role required' })
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
