import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { JobEmailService } from './opportunity.service';
import { SendOpportunityEmailDto } from './dto/send-opportunity-email.dto';
import { ApiResponse } from 'src/common/response.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/types/types';

@ApiTags('v1/jobemail')
@Controller({ path: 'jobemail', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class JobEmailController {
  constructor(private readonly jobemailService: JobEmailService) {}

  @ApiBearerAuth()
  @Post()
  async sendOpportunityEmail(
    @Body() request: SendOpportunityEmailDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<SendOpportunityEmailDto>> {
    const userId = req.user.id;
    const emailDto: SendOpportunityEmailDto = {
      ...request,
      applicantPhone: req.user.phoneNumber,
      applicantName: `${req.user.firstName} ${req.user.lastName}`,
    };
    return this.jobemailService.sendOpportunityApplicationEmail(
      userId,
      emailDto,
    );
  }

  @ApiBearerAuth()
  @Get('applied/:jobId')
  async hasApplied(
    @Param('jobId') jobId: number,
    @Request() req: RequestWithUser,
  ): Promise<{ hasApplied: boolean }> {
    const userId = req.user.id;
    const hasApplied = await this.jobemailService.hasUserApplied(userId, jobId);
    return { hasApplied };
  }
}
