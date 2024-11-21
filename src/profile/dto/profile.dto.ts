import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StakeholderLinksDto {
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentors?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  employers?: string[];
}

export class ProfileDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ type: StakeholderLinksDto, required: false })
  @IsObject()
  @IsOptional()
  stakeholderLinks?: StakeholderLinksDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
