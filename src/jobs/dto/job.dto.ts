import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsArray,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  salary: number;

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

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
