import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsDate,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsObject()
  stakeholderLinks?: {
    mentors?: string[];
    employers?: string[];
  };

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsInt()
  @IsNotEmpty()
  age: number;
}
