import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<UserDto> {
    const userResponse = await this.usersService.findOneByNumber(phoneNumber);

    if (!userResponse || !userResponse.data) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = userResponse.data;
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: UserDto) {
    const payload = {
      phoneNumber: user.phoneNumber,
      sub: user.id,
      role: user.role,
    };
    const { password, ...userWithoutPassword } = user;

    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      expires_in: 3600,
      user: userWithoutPassword,
    };
  }

  async logout(_userId: string): Promise<{ message: string }> {
    // Logout is handled on client side by removing the token
    return { message: 'Logged out successfully' };
  }
}
