import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
  isInt,
  isNotEmpty,
  IsPhoneNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { USER_ROLES } from '../../common/constants';

export class UserDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsEnum(
    [
      USER_ROLES.YOUTH,
      USER_ROLES.MENTOR,
      USER_ROLES.EMPLOYER,
      USER_ROLES.SUPER,
    ],
    {
      message: 'Valid role required',
    },
  )
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'super' | 'staff' | 'employer' | 'admin' = 'youth';
}
