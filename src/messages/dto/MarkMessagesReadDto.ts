import { IsArray, IsInt } from 'class-validator';

export class MarkMessagesReadDto {
  @IsArray()
  @IsInt({ each: true })
  messageIds: number[];
}
