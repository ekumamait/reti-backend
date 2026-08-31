import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERROR_MESSAGES } from '../../common/constants';

export class ParticipantDetailsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nameOfParticipant?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  groupNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  individualNumber?: string;

  @ApiProperty({ required: false })
  @ValidateIf((o) => !!o.nin)
  @Matches(/^(CM|CF)[A-Z0-9]{12}$/, {
    message: ERROR_MESSAGES.INVALID_NIN,
  })
  nin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  age?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialInterestCategory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  disabilityType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  numberOfDisabilities?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainDisabilityDetails?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nationalityCategory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uniqueIdNo?: string;
}
