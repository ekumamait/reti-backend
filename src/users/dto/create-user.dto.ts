import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsDate,
  IsInt,
  MinLength,
  Matches,
  IsBoolean,
  Equals,
} from 'class-validator';
import {
  ERROR_MESSAGES,
  UGANDA_PHONE_NUMBER_REGEX,
  USER_ROLES,
} from '../../common/constants';

export class CreateUserDto {
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

  @IsBoolean()
  @Equals(true, { message: ERROR_MESSAGES.TERMS_NOT_ACCEPTED })
  acceptedTerms: boolean;
}
