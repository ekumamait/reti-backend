import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsArray,
  IsOptional,
  IsEnum,
  IsInt,
  IsEmail,
  ValidateNested,
} from 'class-validator';

class SalaryRange {
  @IsNumber()
  @IsNotEmpty()
  min: number;

  @IsNumber()
  @IsNotEmpty()
  max: number;
}

export class JobDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @ValidateNested()
  @Type(() => SalaryRange)
  salary: SalaryRange;

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

  @IsInt()
  employerId: number;

  @IsInt()
  @IsNotEmpty()
  positions: number;

  @IsString()
  @IsNotEmpty()
  experience: string;

  @IsString()
  @IsNotEmpty()
  jobCategory: string;

  @IsEnum(['fulltime', 'part-time', 'freelance'])
  @IsNotEmpty()
  jobType: 'fulltime' | 'part-time' | 'freelance';

  @IsDate()
  @IsNotEmpty()
  applicationDeadline: Date;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  contactEmail: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
