import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
} from 'class-validator';
import { USER_ROLES } from '../../common/constants';

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

  @IsEnum([USER_ROLES.YOUTH, USER_ROLES.EMPLOYER, USER_ROLES.MENTOR], { message: 'Valid role required' })
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
