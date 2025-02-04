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
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class MentorshipSessionsService {
  constructor(
    @InjectRepository(MentorshipSession)
    private readonly mentorshipSessionRepository: Repository<MentorshipSession>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationsService,
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

    if (session) {
      const [youth, mentor] = await Promise.all([
        this.userRepository.findOneBy({ id: userId }),
        this.userRepository.findOneBy({ id: createDto.mentorId }),
      ]);

      await this.notificationService.create({
        title: 'New Mentorship Session Booked',
        userId: createDto.mentorId,
        message: `${youth?.firstName} has booked a session with you`,
      });

      await this.notificationService.create({
        title: 'Session Booking Confirmation',
        userId: userId,
        message: `Your session with ${mentor?.firstName} has been booked successfully`,
      });
    }
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

    if (session) {
      await this.notificationService.create({
        title: 'Session Updated',
        userId: session.mentor.id,
        message: `Session with ${session.youth.firstName} has been updated`,
      });

      await this.notificationService.create({
        title: 'Session Updated',
        userId: session.youth.id,
        message: `Session with ${session.mentor.firstName} has been updated`,
      });
    }

    const updatedSession = await this.mentorshipSessionRepository.save({
      ...session,
      ...updateDto,
    });

    return returnResponse(200, 'Session updated successfully', updatedSession);
  }
}
