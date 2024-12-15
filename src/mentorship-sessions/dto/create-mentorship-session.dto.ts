import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateMentorshipSessionDto {
  @IsString()
  @IsNotEmpty()
  mentorId: string;

  @IsDate()
  @IsNotEmpty()
  sessionDate: Date;
}
