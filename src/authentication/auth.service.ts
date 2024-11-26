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

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Attempting to validate user:', email);
    const userResponse = await this.usersService.findOneByEmail(email);
    console.log('User response:', userResponse);

    if (!userResponse || !userResponse.data) {
      console.log('User not found or invalid response structure');
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = userResponse.data;
    console.log('Found user:', { ...user, password: '[REDACTED]' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('User validated successfully');
    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    console.log('Creating JWT with payload:', payload);
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      expires_in: 3600,
    };
  }

  async logout(userId: string): Promise<void> {
    console.log(`User with ID ${userId} has logged out.`);
  }
}
