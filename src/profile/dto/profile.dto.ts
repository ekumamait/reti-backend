import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsObject()
  @IsOptional()
  stakeholderLinks?: {
    mentors?: string[];
    employers?: string[];
  };

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Type(() => Date)
  createdAt: Date;

  @Type(() => Date)
  updatedAt: Date;
}
