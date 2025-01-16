import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { UsersService } from '../users/users.service';
import { CreateMentorshipSessionDto } from './dto/create-mentorship-session.dto';
import {
  SUCCESS_MESSAGES,
  USER_ROLES,
  MentorshipSessionStatus,
} from '../common/constants';
import { ApiResponse, returnResponse } from '../common/response.util';
import { UpdateMentorshipSessionDto } from './dto/update-mentorship-session.dto';
import { UserDto } from '../users/dto/user.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MentorshipSessionsService {
  constructor(
    @InjectRepository(MentorshipSession)
    private readonly sessionRepository: Repository<MentorshipSession>,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationsService,
  ) {}

  async bookSession(
    youthId: number,
    createDto: CreateMentorshipSessionDto,
  ): Promise<ApiResponse<MentorshipSession>> {
    const [youth, mentor] = await Promise.all([
      this.usersService.findOne(youthId),
      this.usersService.findOne(createDto.mentorId),
    ]);

    if (!youth || !mentor)
      throw new NotFoundException('Youth or Mentor not found');
    if (youth.role !== USER_ROLES.YOUTH)
      throw new UnauthorizedException('Only youth can book sessions');

    const existingSession = await this.sessionRepository.findOne({
      where: {
        youth: { id: youth.id },
        mentor: { id: mentor.id },
        sessionDate: createDto.sessionDate,
      },
    });
    if (existingSession) throw new ConflictException('Session already exists');

    const session = this.sessionRepository.create({
      ...createDto,
      youth: { id: youth.id },
      mentor: { id: mentor.id },
    });

    const savedSession = await this.sessionRepository.save(session);
    const formattedDate = dayjs(createDto.sessionDate).format(
      'MMMM D, YYYY h:mm A',
    );
    await this.notifyUsers(
      [mentor.id, youth.id],
      'New Session',
      `Session booked for ${formattedDate}`,
    );
    return returnResponse(201, SUCCESS_MESSAGES.SESSION_CREATED, savedSession);
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
  ): Promise<ApiResponse<MentorshipSession>> {
    if (mentor.role !== USER_ROLES.MENTOR)
      throw new ForbiddenException('Only mentors can update sessions');

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, mentor: { id: mentor.id } },
      relations: ['mentor', 'youth'],
    });
    if (!session) throw new NotFoundException('Session not found');

    if (updateDto.status === MentorshipSessionStatus.CANCELED) {
      await this.cancelSession(session, mentor);
    }

    Object.assign(session, updateDto);
    const updatedSession = await this.sessionRepository.save(session);
    await this.notifyUsers(
      [session.mentor.id, session.youth.id],
      'Session Update',
      `Session updated to ${updateDto.status}`,
    );
    return returnResponse(
      200,
      SUCCESS_MESSAGES.SESSION_UPDATED,
      updatedSession,
    );
  }

  async cancelSession(
    updatedSession: MentorshipSession,
    user: UserDto,
  ): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: [
        { id: updatedSession.id, mentor: { id: user.id } },
        { id: updatedSession.id, youth: { id: user.id } },
      ],
      relations: ['youth', 'mentor'],
    });
    if (!session)
      throw new UnauthorizedException('Not authorized to cancel this session');

    session.status = MentorshipSessionStatus.CANCELED;
    const formattedDate = dayjs(session.sessionDate).format(
      'MMMM D, YYYY h:mm A',
    );
    await this.sessionRepository.save(session);
    await this.notifyUsers(
      [session?.youth.id, session?.mentor.id],
      'Session Canceled',
      `Session scheduled for ${formattedDate} has been canceled.`,
    );
  }

  private async notifyUsers(
    userIds: number[],
    title: string,
    message: string,
  ): Promise<void> {
    const notifications = userIds?.map((userId) =>
      this.notificationService.create({ title, userId, message }),
    );
    await Promise.all(notifications);
  }
}
