import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsEmail,
  IsDate,
  ValidateNested,
} from 'class-validator';

class SalaryRange {
  @IsNumber()
  @IsOptional()
  min?: number;

  @IsNumber()
  @IsOptional()
  max?: number;
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ValidateNested()
  @Type(() => SalaryRange)
  @IsOptional()
  salary?: SalaryRange;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  qualifications?: string[];

  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  interested?: number[];

  @IsNumber()
  @IsOptional()
  positions?: number;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsString()
  @IsOptional()
  jobCategory?: string;

  @IsEnum(['fulltime', 'part-time', 'freelance'])
  @IsOptional()
  jobType?: 'fulltime' | 'part-time' | 'freelance';

  @IsDate()
  @IsOptional()
  applicationDeadline?: Date;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;
}
