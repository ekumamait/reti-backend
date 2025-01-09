import {
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(['youth', 'mentor', 'employer', 'admin'], {
    message: 'Valid role required',
  })
  role?: 'youth' | 'mentor' | 'employer' | 'admin';

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
