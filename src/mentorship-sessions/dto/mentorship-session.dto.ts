import { IsString, IsDate, IsEnum, IsNumber } from 'class-validator';

export class MentorshipSessionDto {
  @IsNumber()
  mentorId: number;

  @IsDate()
  sessionDate: Date;

  @IsNumber()
  duration: number;

  @IsString()
  notes?: string;

  @IsEnum(['CANCELED', 'COMPLETED', 'PENDING', 'CONFIRMED'])
  status: 'CANCELED' | 'COMPLETED' | 'PENDING' | 'CONFIRMED';
}
