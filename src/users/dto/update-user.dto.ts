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
  @IsEnum(['youth', 'mentor', 'employer'], { message: 'Valid role required' })
  role?: 'youth' | 'mentor' | 'employer';

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
