import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SupportRequestStatus } from '../../database/entities/support-request.entity';

export class RespondSupportRequestDto {
  @ApiProperty({ example: 'We have fixed the issue, please try again.' })
  @IsString()
  @IsNotEmpty()
  response: string;

  @ApiProperty({ enum: SupportRequestStatus, required: false })
  @IsEnum(SupportRequestStatus)
  @IsOptional()
  status?: SupportRequestStatus;
}
