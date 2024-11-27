import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateConversationDto {
  @IsInt()
  user1id: number;

  @IsInt()
  user2id: number;
}
