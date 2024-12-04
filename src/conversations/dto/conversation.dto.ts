import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { MessageDTO } from './create-conversation.dto';

export class ConversationDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MessageDTO)
  messages: MessageDTO[];

  @IsDate()
  createdAt: Date;
}
