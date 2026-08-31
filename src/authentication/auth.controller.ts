import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('v1/auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() body: { phoneNumber: string; password: string },
  ): Promise<any> {
    const user = await this.authService.validateUser(
      body.phoneNumber,
      body.password,
    );
    return this.authService.login(user);
  }

  @Delete('logout')
  async logout(@Body() body: { userId: string }): Promise<any> {
    return this.authService.logout(body.userId);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(ValidationPipe) dto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(ValidationPipe) dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
