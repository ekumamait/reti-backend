import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
} from 'class-validator';

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

  @IsNumber()
  @IsOptional()
  salary?: number;

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
