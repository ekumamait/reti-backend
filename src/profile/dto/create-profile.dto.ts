import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

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
}
