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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsEnum(['youth', 'mentor', 'employer'], { message: 'Valid role required' })
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
