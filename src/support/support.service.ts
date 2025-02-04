import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendSupportRequestDto } from './dto/send-support-request.dto';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendSupportEmail(
    description: string,
    contact?: string,
  ): Promise<ApiResponse<SendSupportRequestDto>> {
    await this.mailerService.sendMail({
      to: process.env.SMTP_USER,
      subject: 'New Support Request',
      template: 'support-request',
      context: {
        contact: contact,
        description: description,
      },
    });
    return returnResponse(201, 'Support request sent successfully');
  }
}
