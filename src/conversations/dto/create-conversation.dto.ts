import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsString,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class MessageDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  senderId: number;

  @IsInt()
  receiverId: number;

  @IsString()
  content: string;

  @IsOptional()
  @Transform(({ value }) => value ?? new Date())
  timestamp?: Date;

  @IsOptional()
  @Transform(({ value }) => value ?? false)
  read?: boolean;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  receiver?: string;
}

export class CreateConversationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];
}
