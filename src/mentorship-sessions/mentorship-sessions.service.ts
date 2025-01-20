import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { CreateMentorshipSessionDto } from './dto/create-mentorship-session.dto';
import { UpdateMentorshipSessionDto } from './dto/update-mentorship-session.dto';
import { MentorshipSessionQueryDto } from './dto/mentorship-session-query.dto';
import { User } from '../database/entities/user.entity';
import { ApiResponse, returnResponse } from '../common/response.util';
import {
  PaginatedResponse,
  getPaginationParams,
  createPaginatedResponse,
} from '../common/pagination.util';

@Injectable()
export class MentorshipSessionsService {
  constructor(
    @InjectRepository(MentorshipSession)
    private readonly mentorshipSessionRepository: Repository<MentorshipSession>,
  ) {}

  async bookSession(
    userId: number,
    createDto: CreateMentorshipSessionDto,
  ): Promise<ApiResponse<MentorshipSession>> {
    const session = this.mentorshipSessionRepository.create({
      ...createDto,
      youth: { id: userId },
      mentor: { id: createDto.mentorId },
    });
    const savedSession = await this.mentorshipSessionRepository.save(session);
    return returnResponse(201, 'Session booked successfully', savedSession);
  }

  async findAll(
    query?: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [sessions, total] =
      await this.mentorshipSessionRepository.findAndCount({
        relations: ['mentor', 'youth'],
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Sessions fetched successfully',
      sessions,
      total,
      page,
      limit,
    );
  }

  async findMentorSessions(
    mentorId: number,
    query?: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [sessions, total] =
      await this.mentorshipSessionRepository.findAndCount({
        where: { mentor: { id: mentorId } },
        relations: ['mentor', 'youth'],
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Mentor sessions fetched successfully',
      sessions,
      total,
      page,
      limit,
    );
  }

  async findYouthSessions(
    youthId: number,
    query?: MentorshipSessionQueryDto,
  ): Promise<PaginatedResponse<MentorshipSession>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [sessions, total] =
      await this.mentorshipSessionRepository.findAndCount({
        where: { youth: { id: youthId } },
        relations: ['mentor', 'youth'],
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Youth sessions fetched successfully',
      sessions,
      total,
      page,
      limit,
    );
  }

  async getOneSession(id: number): Promise<ApiResponse<MentorshipSession>> {
    const session = await this.mentorshipSessionRepository.findOne({
      where: { id },
      relations: ['mentor', 'youth'],
    });

    if (!session) {
      throw new NotFoundException(`Session #${id} not found`);
    }

    return returnResponse(200, 'Session fetched successfully', session);
  }

  async updateSession(
    user: User,
    sessionId: number,
    updateDto: UpdateMentorshipSessionDto,
  ): Promise<ApiResponse<MentorshipSession>> {
    const session = await this.mentorshipSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['mentor', 'youth'],
    });

    if (!session) {
      throw new NotFoundException(`Session #${sessionId} not found`);
    }

    // Only allow youth or mentor to update their own sessions
    if (session.youth.id !== user.id && session.mentor.id !== user.id) {
      throw new NotFoundException(`Session #${sessionId} not found`);
    }

    const updatedSession = await this.mentorshipSessionRepository.save({
      ...session,
      ...updateDto,
    });

    return returnResponse(200, 'Session updated successfully', updatedSession);
  }
}
