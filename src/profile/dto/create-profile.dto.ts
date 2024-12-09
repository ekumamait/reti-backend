import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsDate,
  IsNotEmpty,
  IsInt,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StakeholderLinksDto } from './profile.dto';

export class CreateProfileDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({ type: StakeholderLinksDto, required: false })
  @IsOptional()
  @IsObject()
  stakeholderLinks?: StakeholderLinksDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email: string;

  @IsInt()
  @IsNotEmpty()
  age: number;
}
