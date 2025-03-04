import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendOpportunityEmailDto {
  @IsInt()
  @IsNotEmpty()
  jobId: number;

  @IsEmail()
  @IsNotEmpty()
  employerEmail: string;

  @IsString()
  @IsNotEmpty()
  employerName: string;

  @IsString()
  @IsNotEmpty()
  applicantName: string;

  @IsString()
  @IsNotEmpty()
  applicantPhone: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;
}
