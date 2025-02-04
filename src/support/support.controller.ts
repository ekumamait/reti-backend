import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { SupportService } from './support.service';
import { SendSupportRequestDto } from './dto/send-support-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { RequestWithUser } from 'src/common/types/types';
import { OptionalJwtAuthGuard } from 'src/authentication/guards/optional-jwt.guard';

@ApiTags('v1/support')
@Controller({ path: 'support', version: '1' })
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async sendSupportRequest(
    @Body() request: SendSupportRequestDto,
    @Request() req?: RequestWithUser,
  ): Promise<ApiResponse<SendSupportRequestDto>> {
    let contact = request.contact;
    if (req.user) {
      contact = req.user.phoneNumber;
    }
    return this.supportService.sendSupportEmail(request.description, contact);
  }
}
