import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
  IsPhoneNumber,
} from 'class-validator';
import { USER_ROLES } from '../../common/constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(
    [
      USER_ROLES.YOUTH,
      USER_ROLES.EMPLOYER,
      USER_ROLES.MENTOR,
      USER_ROLES.SUPER,
      USER_ROLES.STAFF,
    ],
    {
      message: 'Valid role required',
    },
  )
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'super' | 'staff' | 'employer' | 'admin' = 'youth';

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
