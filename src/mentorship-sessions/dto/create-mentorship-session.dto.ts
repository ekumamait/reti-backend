import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  IsOptional,
  IsUUID,
  Validate,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FutureDateValidator } from '../../common/validators/future-date.validator';
import { MentorshipSessionStatus } from '../../common/constants';

export class CreateMentorshipSessionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Mentor ID is required' })
  mentorId: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Session date is required' })
  @Validate(FutureDateValidator)
  sessionDate: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Duration is required' })
  @Min(30)
  @Max(180)
  duration: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsNotEmpty()
  @IsEnum(['CANCELED', 'COMPLETED', 'PENDING', 'CONFIRMED'])
  status: 'CANCELED' | 'COMPLETED' | 'PENDING' | 'CONFIRMED';
}
