import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../database/entities/user.entity';
import { Profile } from '../database/entities/profile.entity';
import { PasswordResetToken } from '../database/entities/password-reset-token.entity';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserDto } from 'src/users/dto/user.dto';
import {
  ERROR_MESSAGES,
  PASSWORD_RESET_TOKEN_TTL_MS,
  SUCCESS_MESSAGES,
} from 'src/common/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(PasswordResetToken)
    private resetTokenRepository: Repository<PasswordResetToken>,
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
      expires_in: 7200,
      user: userWithoutPassword,
    };
  }

  async logout(_userId: string): Promise<{ message: string }> {
    // Logout is handled on client side by removing the token
    return { message: 'Logged out successfully' };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const genericResponse = {
      message: SUCCESS_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    };

    // Recovery email lives on Profile (set during onboarding), not User. There's no
    // uniqueness constraint on Profile.email, so only proceed on an unambiguous match —
    // and always return the same generic response either way to avoid leaking which
    // emails are registered.
    const matchingProfiles = await this.profileRepository.find({
      where: { email },
      relations: ['user'],
    });

    if (matchingProfiles.length !== 1 || !matchingProfiles[0].user) {
      return genericResponse;
    }

    const { user } = matchingProfiles[0];

    await this.resetTokenRepository.delete({ userId: user.id });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetToken = this.resetTokenRepository.create({
      userId: user.id,
      tokenHash: this.hashToken(rawToken),
      expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS),
    });
    await this.resetTokenRepository.save(resetToken);

    const frontendUrl =
      process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL;
    const resetLink = `${frontendUrl}/forgot-password?token=${rawToken}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your RETI password',
      template: 'reset-password',
      context: {
        firstName: user.firstName,
        resetLink,
      },
    });

    return genericResponse;
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { tokenHash: this.hashToken(token) },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException(
        ERROR_MESSAGES.INVALID_OR_EXPIRED_RESET_TOKEN,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.setPassword(resetToken.userId, hashedPassword);

    resetToken.usedAt = new Date();
    await this.resetTokenRepository.save(resetToken);

    return { message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS };
  }
}
