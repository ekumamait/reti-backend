import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { UsersService } from '../users/users.service';
import { CreateMentorshipSessionDto } from './dto/create-mentorship-session.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../common/constants';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { UpdateMentorshipSessionDto } from './dto/update-mentorship-session.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { MentorshipSessionDto } from './dto/mentorship-session.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class MentorshipSessionsService {
  constructor(
    @InjectRepository(MentorshipSession)
    private sessionRepository: Repository<MentorshipSession>,
    private usersService: UsersService,
    private notificationService: NotificationsService,
  ) {}

  async bookSession(
    youthId: number,
    createDto: CreateMentorshipSessionDto,
  ): Promise<ApiResponse<MentorshipSessionDto>> {
    const youth = await this.usersService.findOne(youthId);
    const mentor = await this.usersService.findOne(createDto.mentorId);

    if (!youth || !mentor) {
      throw new NotFoundException('Youth or Mentor not found');
    }

    if (youth.role !== 'youth') {
      throw new UnauthorizedException('Only youth can book sessions');
    }

    const existingSession = await this.sessionRepository.findOne({
      where: {
        youth: { id: youth.id },
        mentor: { id: mentor.id },
        sessionDate: createDto.sessionDate,
      },
    });

    if (existingSession) {
      throw new ConflictException(
        'A Session with the same Mentor already exists for this profile.',
      );
    }

    const session = this.sessionRepository.create({
      youth: { id: youth.id },
      mentor: { id: mentor.id },
      sessionDate: createDto.sessionDate,
      duration: createDto.duration,
      notes: createDto.notes,
      meetingLink: createDto.meetingLink,
      status: createDto.status,
      title: createDto.title,
    });

    const savedSession = await this.sessionRepository.save(session);
    if (savedSession) {
      this.notificationService.create({
        title: 'New Session',
        userId: mentor.id,
        message: `You have a new session with ${youth.firstName} || ${mentor.firstName} on ${createDto.sessionDate}`,
      });
    }
    return returnResponse(
      201,
      SUCCESS_MESSAGES.INSPIRATION_CREATED,
      savedSession,
    );
  }

  async getAllSessions(): Promise<ApiResponse<MentorshipSession[]>> {
    const sessions = await this.sessionRepository.find({
      relations: ['mentor', 'youth'],
    });
    return returnResponse(200, SUCCESS_MESSAGES.SESSIONS_FOUND, sessions);
  }

  async getMentorSessions(
    mentorId: number,
  ): Promise<ApiResponse<MentorshipSession[]>> {
    const sessions = await this.sessionRepository.find({
      where: {
        mentor: { id: mentorId },
      },
      relations: ['mentor', 'youth'],
    });
    return returnResponse(200, SUCCESS_MESSAGES.SESSIONS_FOUND, sessions);
  }

  async getYouthSessions(
    youthId: number,
  ): Promise<ApiResponse<MentorshipSession[]>> {
    const sessions = await this.sessionRepository.find({
      where: {
        youth: { id: youthId },
      },
      relations: ['mentor', 'youth'],
    });
    return returnResponse(200, SUCCESS_MESSAGES.SESSIONS_FOUND, sessions);
  }

  async getOneSession(
    mentorId: number,
  ): Promise<ApiResponse<MentorshipSession>> {
    const session = await this.sessionRepository.findOne({
      where: { id: mentorId },
      relations: ['mentor', 'youth'],
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${mentorId} not found`);
    }
    return returnResponse(200, SUCCESS_MESSAGES.SESSIONS_FOUND, session);
  }

  async updateSession(
    mentor: UserDto,
    sessionId: number,
    updateDto: UpdateMentorshipSessionDto,
  ): Promise<ApiResponse<MentorshipSessionDto>> {
    if (mentor.role !== 'mentor') {
      throw new ForbiddenException('Only mentor can update sessions');
    }
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        mentor: { id: mentor.id },
      },
      relations: ['mentor', 'youth'],
    });

    if (!session) {
      throw new NotFoundException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (updateDto.status === 'CANCELED') {
      this.cancelSession(sessionId, mentor);
    }

    Object.assign(session, updateDto);
    const updatedSession = await this.sessionRepository.save(session);
    if (updatedSession) {
      this.notificationService.create({
        title: 'Session Update',
        userId: mentor.id,
        message: `You have a new session update with ${mentor.firstName} on ${updateDto.sessionDate}`,
      });
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.INSPIRATION_UPDATED,
      updatedSession,
    );
  }

  async cancelSession(sessionId: number, user: UserDto) {
    const session = await this.sessionRepository.findOne({
      where: [
        { id: sessionId, mentor: { id: user.id } },
        { id: sessionId, youth: { id: user.id } },
      ],
    });

    if (!session) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    session.status = 'CANCELED';
    const cancelledSession = this.sessionRepository.save(session);
    if (cancelledSession) {
      this.notificationService.create({
        title: 'Session CANCELED',
        userId: user.id,
        message: `Your session with ${user.firstName} has been canceled`,
      });
    }
  }
}
