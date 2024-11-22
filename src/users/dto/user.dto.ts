import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEnum(['youth', 'mentor', 'employer'], { message: 'Valid role required' })
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';
}
