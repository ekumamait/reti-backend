import { Controller, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(GoogleAuthGuard)
  @Post('login/google')
  async googleLogin(@Body() body: any): Promise<any> {
    return this.authService.login(body.user);
  }

  @Delete('logout')
  async logout(@Body() body: { userId: string }): Promise<any> {
    return this.authService.logout(body.userId);
  }
}
