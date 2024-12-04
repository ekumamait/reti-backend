import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class NotificationDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsBoolean()
  @IsOptional()
  isRead: boolean;

  @IsNumber()
  @IsOptional()
  userId: number;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
