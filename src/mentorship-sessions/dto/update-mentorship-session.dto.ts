import {
  IsOptional,
  IsDate,
  IsEnum,
  Validate,
  IsNumber,
  Min,
  Max,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FutureDateValidator } from '../../common/validators/future-date.validator';

export class UpdateMentorshipSessionDto {
  @IsString()
  @IsOptional()
  @MaxLength(20)
  title: string;

  @IsString()
  @IsOptional()
  meetingLink: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Validate(FutureDateValidator, {
    message: 'Session date must be in the future',
  })
  sessionDate?: Date;

  @IsNumber()
  @IsOptional()
  @Min(30)
  @Max(180)
  duration: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
