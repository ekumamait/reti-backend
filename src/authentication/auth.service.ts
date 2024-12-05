import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const userResponse = await this.usersService.findOneByEmail(email);

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

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      expires_in: 3600,
      user,
    };
  }

  async logout(_userId: string): Promise<{ message: string }> {
    // Logout is handled on client side by removing the token
    return { message: 'Logged out successfully' };
  }
}
