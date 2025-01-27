import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MentorshipSessionsService } from './mentorship-sessions.service';
import { CreateMentorshipSessionDto } from './dto/create-mentorship-session.dto';
import { UpdateMentorshipSessionDto } from './dto/update-mentorship-session.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { MentorshipSessionQueryDto } from './dto/mentorship-session-query.dto';
import { PaginatedResponse } from '../common/pagination.util';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { RequestWithUser } from '../common/types/types';
import { ApiResponse } from '../common/response.util';

@ApiTags('v1/mentorship-sessions')
@Controller({ path: 'mentorship-sessions', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class MentorshipSessionsController {
  constructor(
    private readonly mentorshipSessionsService: MentorshipSessionsService,
  ) {}

  @Post()
  async bookSession(
    @Body() createDto: CreateMentorshipSessionDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.bookSession(req.user.id, createDto);
  }

  @Get()
  async findAll(
    @Query() query: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.findAll(query);
  }

  @Get('mentor')
  async getMentorSessions(
    @Request() req: RequestWithUser,
    @Query() query: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.findMentorSessions(
      req.user.id,
      query,
    );
  }

  @Get('youth')
  async getYouthSessions(
    @Request() req: RequestWithUser,
    @Query() query: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.findYouthSessions(req.user.id, query);
  }

  @Get(':id')
  async getOneSession(
    @Param('id') id: number,
  ): Promise<ApiResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.getOneSession(id);
  }

  @Patch(':id')
  async updateSession(
    @Param('id') sessionId: number,
    @Body() updateDto: UpdateMentorshipSessionDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<MentorshipSession>> {
    return this.mentorshipSessionsService.updateSession(
      req.user,
      sessionId,
      updateDto,
    );
  }
}
