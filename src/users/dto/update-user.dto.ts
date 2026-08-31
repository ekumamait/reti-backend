import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import {
  ERROR_MESSAGES,
  UGANDA_PHONE_NUMBER_REGEX,
} from '../../common/constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @Matches(UGANDA_PHONE_NUMBER_REGEX, {
    message: ERROR_MESSAGES.INVALID_PHONE_NUMBER,
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(['youth', 'mentor', 'employer', 'admin', 'super', 'staff'], {
    message: 'Valid role required',
  })
  role?: 'youth' | 'mentor' | 'employer' | 'admin' | 'super' | 'staff';

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
