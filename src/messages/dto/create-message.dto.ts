import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  senderId: number;

  @IsInt()
  receiverId: number;

  @IsInt()
  conversationId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
