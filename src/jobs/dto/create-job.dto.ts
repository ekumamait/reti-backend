import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
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

export class CreateJobDto {
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
}
