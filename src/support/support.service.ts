import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { SendSupportRequestDto } from './dto/send-support-request.dto';
import { RespondSupportRequestDto } from './dto/respond-support-request.dto';
import { SupportQueryDto } from './dto/support-query.dto';
import {
  SupportRequest,
  SupportRequestStatus,
} from '../database/entities/support-request.entity';
import { User } from '../database/entities/user.entity';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import {
  PaginatedResponse,
  createPaginatedResponse,
  getPaginationParams,
} from 'src/common/pagination.util';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SUPPORT_EMAIL,
  USER_ROLES,
} from 'src/common/constants';

const STAFF_ROLES: string[] = [
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER,
  USER_ROLES.STAFF,
];

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @InjectRepository(SupportRequest)
    private readonly supportRequestRepository: Repository<SupportRequest>,
    private readonly mailerService: MailerService,
  ) {}

  async createSupportRequest(
    dto: SendSupportRequestDto,
    user: User | null,
  ): Promise<ApiResponse<SupportRequest>> {
    const contact = user ? user.phoneNumber : dto.contact;

    const supportRequest = this.supportRequestRepository.create({
      contact,
      category: dto.category,
      description: dto.description,
      userId: user?.id ?? null,
    });
    const saved = await this.supportRequestRepository.save(supportRequest);

    await this.mailerService.sendMail({
      to: SUPPORT_EMAIL,
      subject: `New Support Request #${saved.id}`,
      template: 'support-request',
      context: {
        id: saved.id,
        contact,
        category: saved.category,
        description: saved.description,
      },
    });

    return returnResponse(201, SUCCESS_MESSAGES.SUPPORT_REQUEST_CREATED, saved);
  }

  async findMine(
    userId: number,
    query?: SupportQueryDto,
  ): Promise<PaginatedResponse<SupportRequest>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [requests, total] = await this.supportRequestRepository.findAndCount({
      where: { userId },
      skip,
      take: limit,
      order: { [sortBy === 'search' ? 'createdAt' : sortBy]: sortOrder },
    });

    return createPaginatedResponse(
      200,
      SUCCESS_MESSAGES.SUPPORT_REQUESTS_FOUND,
      requests,
      total,
      page,
      limit,
    );
  }

  async findAll(
    query?: SupportQueryDto,
  ): Promise<PaginatedResponse<SupportRequest>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const whereClause: any = {};
    if (query?.status) {
      whereClause.status = query.status;
    }

    const [requests, total] = await this.supportRequestRepository.findAndCount({
      where: whereClause,
      skip,
      take: limit,
      order: { [sortBy === 'search' ? 'createdAt' : sortBy]: sortOrder },
      relations: ['user', 'respondedBy'],
    });

    return createPaginatedResponse(
      200,
      SUCCESS_MESSAGES.SUPPORT_REQUESTS_FOUND,
      requests,
      total,
      page,
      limit,
    );
  }

  async findOne(
    id: number,
    requester: User,
  ): Promise<ApiResponse<SupportRequest>> {
    const supportRequest = await this.supportRequestRepository.findOne({
      where: { id },
      relations: ['user', 'respondedBy'],
    });

    if (!supportRequest) {
      throw new NotFoundException(ERROR_MESSAGES.SUPPORT_REQUEST_NOT_FOUND(id));
    }

    const isOwner = supportRequest.userId === requester.id;
    const isStaff = STAFF_ROLES.includes(requester.role);
    if (!isOwner && !isStaff) {
      throw new ForbiddenException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.SUPPORT_REQUEST_FOUND,
      supportRequest,
    );
  }

  async respond(
    id: number,
    dto: RespondSupportRequestDto,
    admin: User,
  ): Promise<ApiResponse<SupportRequest>> {
    const supportRequest = await this.supportRequestRepository.findOne({
      where: { id },
      relations: ['user', 'user.profile'],
    });

    if (!supportRequest) {
      throw new NotFoundException(ERROR_MESSAGES.SUPPORT_REQUEST_NOT_FOUND(id));
    }

    supportRequest.adminResponse = dto.response;
    supportRequest.status = dto.status || SupportRequestStatus.RESOLVED;
    supportRequest.respondedById = admin.id;
    supportRequest.respondedAt = new Date();

    const saved = await this.supportRequestRepository.save(supportRequest);

    const notifyEmail = saved.user?.profile?.email;
    if (notifyEmail) {
      await this.mailerService
        .sendMail({
          to: notifyEmail,
          subject: `Update on your support request #${saved.id}`,
          template: 'support-response',
          context: {
            id: saved.id,
            response: saved.adminResponse,
            status: saved.status,
          },
        })
        .catch((err) =>
          this.logger.warn(
            `Failed to email support response for request ${saved.id}: ${err.message}`,
          ),
        );
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.SUPPORT_REQUEST_RESPONDED,
      saved,
    );
  }
}
