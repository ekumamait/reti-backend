import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MentorshipSessionsService } from './mentorship-sessions.service';
import { MentorshipSessionDto } from './dto/mentorship-session.dto';
import { CreateMentorshipSessionDto } from './dto/create-mentorship-session.dto';
import { UpdateMentorshipSessionDto } from './dto/update-mentorship-session.dto';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from 'src/common/response.util';
import { RequestWithUser } from 'src/common/types/types';

@ApiTags('v1/mentorship-sessions')
@Controller({ path: 'mentorship-sessions', version: '1' })
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MentorshipSessionsController {
  constructor(
    private readonly mentorshipSessionsService: MentorshipSessionsService,
  ) {}

  @Post()
  @Roles('youth')
  async bookSession(
    @Body() createDto: CreateMentorshipSessionDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSessionDto>> {
    return this.mentorshipSessionsService.bookSession(req.user.id, createDto);
  }

  @Get('admin')
  @Roles('admin')
  async getAllSessions(): Promise<ApiResponse<MentorshipSessionDto[]>> {
    return this.mentorshipSessionsService.getAllSessions();
  }

  @Get('mentor')
  @Roles('mentor')
  async getMentorSessions(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSessionDto[]>> {
    return this.mentorshipSessionsService.getMentorSessions(req.user.id);
  }

  @Get('youth')
  @Roles('youth')
  async getYouthSessions(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSessionDto[]>> {
    return this.mentorshipSessionsService.getYouthSessions(req.user.id);
  }

  @Get(':id')
  async getOneSession(
    @Param('id') id: number,
  ): Promise<ApiResponse<MentorshipSessionDto>> {
    return this.mentorshipSessionsService.getOneSession(id);
  }

  @Patch(':id')
  @Roles('mentor')
  async updateSession(
    @Param('id') sessionId: number,
    @Body() updateDto: UpdateMentorshipSessionDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSessionDto>> {
    return this.mentorshipSessionsService.updateSession(
      req.user,
      sessionId,
      updateDto,
    );
  }

  @Delete(':id')
  async cancelSession(
    @Param('id') sessionId: number,
    @Request() req: RequestWithUser,
  ) {
    return this.mentorshipSessionsService.cancelSession(sessionId, req.user);
  }
}
