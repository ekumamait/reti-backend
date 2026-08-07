import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWelcomeImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}
