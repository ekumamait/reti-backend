import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendSupportRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsString()
  @IsOptional()
  contact: string;

  @ApiProperty({ example: 'I need help with...' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
