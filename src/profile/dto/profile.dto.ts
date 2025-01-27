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
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

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

  @ApiProperty()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  updatedAt: Date;
}
