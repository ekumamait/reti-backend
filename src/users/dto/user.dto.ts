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
  Matches,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ERROR_MESSAGES,
  UGANDA_PHONE_NUMBER_REGEX,
  USER_ROLES,
} from '../../common/constants';

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

  @Matches(UGANDA_PHONE_NUMBER_REGEX, {
    message: ERROR_MESSAGES.INVALID_PHONE_NUMBER,
  })
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
