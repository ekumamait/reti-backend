import { Request } from '@nestjs/common';
import { UserDto } from '../../users/dto/user.dto';

export type RequestWithUser = Request & {
  user: UserDto;
};
