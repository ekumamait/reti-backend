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

export class MessageDTO {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  receiverId: number;

  @IsString()
  content: string;

  @IsOptional()
  @Transform(({ value }) => value ?? new Date())
  createdAt: Date;

  @IsOptional()
  @Transform(({ value }) => value ?? false)
  isRead?: boolean;
}

export class CreateConversationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];
}
