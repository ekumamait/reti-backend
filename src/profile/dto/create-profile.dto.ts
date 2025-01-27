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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  skillsAndTraining?: {
    traineeCategory?: string;
    trainingDuration?: string;
    trainingLocation?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  artisanDetails?: {
    categoryOfArtisan?: string;
    nameOfHost?: string;
    villageOfArtisan?: string;
    subcountyOfArtisan?: string;
    centerRefugeeSettlement?: string;
    hostContact?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  geoLocationDetails?: {
    partnerResponsible?: string;
    region?: string;
    district?: string;
    settlement?: string;
    subCounty?: string;
    parishZoneCluster?: string;
    village?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  participantDetails?: {
    nameOfParticipant?: string;
    groupNumber?: string;
    individualNumber?: string;
    nin?: string;
    sex?: string;
    age?: string;
    maritalStatus?: string;
    specialInterestCategory?: string;
    disabilityType?: string;
    numberOfDisabilities?: string;
    mainDisabilityDetails?: string;
    nationalityCategory?: string;
    uniqueIdNo?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  trainingCentreDetails?: {
    nameOfTrainingCentre?: string;
    locationVillage?: string;
    locationSubCounty?: string;
    locationSettlement?: string;
    mainTelephoneContact?: string;
    alternativeTelephoneContact?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  trainingCohorts?: {
    cohort?: string;
    tradeTakenDuringTraining?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  retiTrainingDetails?: {
    startTime?: Date;
    completionStatus?: string;
    reasonForDroppingOut?: string;
    monthsSpent?: string;
    certificationStatus?: string;
  };

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  internshipAndStartupDetails?: {
    completionTime?: Date;
    internshipPlacement?: string;
    startupKitReceived?: string;
    startupGrantReceived?: string;
  };
}
