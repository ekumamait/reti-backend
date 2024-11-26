import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  IsObject,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StakeholderLinksDto } from './profile.dto';

export class CreateProfileDto {
  @ApiProperty({ required: true })
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

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

  @ApiProperty({ type: StakeholderLinksDto, required: false })
  @IsOptional()
  @IsObject()
  stakeholderLinks?: StakeholderLinksDto;
}
