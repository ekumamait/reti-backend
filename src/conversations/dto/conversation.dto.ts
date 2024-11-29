import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { UserDto } from 'src/users/dto/user.dto';

export type SimpleUserDto = Pick<UserDto, 'firstName' | 'lastName'>;

export class ConversationDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user1: SimpleUserDto;

  @IsNotEmpty()
  user2: SimpleUserDto;
}
