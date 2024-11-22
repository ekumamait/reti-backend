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
import { USER_ROLES } from '../../common/constants';

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

  @IsEnum([USER_ROLES.YOUTH, USER_ROLES.MENTOR, USER_ROLES.EMPLOYER], {
    message: 'Valid role required',
  })
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';
}
