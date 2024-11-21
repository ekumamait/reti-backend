import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
} from 'class-validator';
<<<<<<< HEAD
=======
import { Type } from 'class-transformer';
import { USER_ROLES } from '../../common/constants';
>>>>>>> 0474985 (rename folders and add common folder and use constants)

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

<<<<<<< HEAD
  @IsEnum(['youth', 'mentor', 'employer'], { message: 'Valid role required' })
=======
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @IsEnum([USER_ROLES.YOUTH, USER_ROLES.MENTOR, USER_ROLES.EMPLOYER], {
    message: 'Valid role required',
  })
>>>>>>> 0474985 (rename folders and add common folder and use constants)
  @IsNotEmpty()
  role: 'youth' | 'mentor' | 'employer' = 'youth';

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
