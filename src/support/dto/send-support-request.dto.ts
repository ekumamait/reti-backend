import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SupportRequestCategory } from '../../database/entities/support-request.entity';

export class SendSupportRequestDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsString()
  @IsOptional()
  contact?: string;

  @ApiProperty({
    enum: SupportRequestCategory,
    example: SupportRequestCategory.GENERAL,
    required: false,
  })
  @IsEnum(SupportRequestCategory)
  @IsOptional()
  category?: SupportRequestCategory;

  @ApiProperty({ example: 'I need help with...' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
