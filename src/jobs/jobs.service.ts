import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from 'src/database/entities/job.entity';
import { User } from 'src/database/entities/user.entity';
import { JobDto } from './dto/job.dto';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { UserDto } from 'src/users/dto/user.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Like, ILike } from 'typeorm';
import { JobQueryDto } from './dto/job-query.dto';
import {
  PaginatedResponse,
  createPaginatedResponse,
  getPaginationParams,
} from 'src/common/pagination.util';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private notificationService: NotificationsService,
  ) {}
  async createJob(
    employer: UserDto,
    createJobDto: CreateJobDto,
  ): Promise<ApiResponse<JobDto>> {
    if (employer.role !== 'employer') {
      throw new ForbiddenException('Only employers can create jobs');
    }
    const existingJob = await this.jobRepository.findOne({
      where: {
        title: createJobDto.title,
        location: createJobDto.location,
        employer: { id: employer.id },
      },
    });

    if (existingJob) {
      throw new ConflictException(
        'A job with the same title and location already exists for this employer.',
      );
    }
    const allUsers = await this.userRepository.find();
    const job = this.jobRepository.create({
      ...createJobDto,
      employer: employer,
    });
    if (job) {
      const youthUsers = allUsers.filter((user) => user.role === 'youth');
      for (const user of youthUsers) {
        await this.notificationService.create({
          title: 'New Job Opportunity',
          userId: user?.id,
          message: 'Head over to the Opportunities page to check it out',
        });
      }
    }
    const savedJob = await this.jobRepository.save(job);
    return returnResponse(201, SUCCESS_MESSAGES.JOB_CREATED, savedJob);
  }

  async getAllJobs(query?: JobQueryDto): Promise<PaginatedResponse<JobDto>> {
    const { page, limit, skip, search, sortBy, sortOrder } =
      getPaginationParams(query || {});

    const whereClause: any = {};
    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }
    if (query?.location) {
      whereClause.location = ILike(`%${query.location}%`);
    }
    if (query?.type) {
      whereClause.jobType = query.type;
    }

    const [jobs, total] = await this.jobRepository.findAndCount({
      where: whereClause,
      relations: ['employer'],
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return createPaginatedResponse(
      200,
      SUCCESS_MESSAGES.JOBS_FOUND,
      jobs,
      total,
      page,
      limit,
    );
  }

  async getEmployerJobs(
    employerId: number,
    query?: JobQueryDto,
  ): Promise<PaginatedResponse<JobDto>> {
    const { page, limit, skip, search, sortBy, sortOrder } =
      getPaginationParams(query || {});

    const whereClause: any = { employer: { id: employerId } };
    if (search) {
      whereClause.title = ILike(`%${search}%`);
    }
    if (query?.location) {
      whereClause.location = ILike(`%${query.location}%`);
    }
    if (query?.type) {
      whereClause.jobType = query.type;
    }

    const [jobs, total] = await this.jobRepository.findAndCount({
      where: whereClause,
      relations: ['employer'],
      skip,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return createPaginatedResponse(
      200,
      SUCCESS_MESSAGES.JOBS_FOUND,
      jobs,
      total,
      page,
      limit,
    );
  }

  async getOneJob(id: number): Promise<ApiResponse<JobDto>> {
    const job = await this.jobRepository.findOne({
      where: { id: id },
      relations: ['employer'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return returnResponse(200, SUCCESS_MESSAGES.JOBS_FOUND, job);
  }

  async updateJob(
    employer: UserDto,
    jobId: number,
    updateJobDto: UpdateJobDto,
  ): Promise<ApiResponse<JobDto>> {
    if (employer.role !== 'employer') {
      throw new ForbiddenException('Only employers can update jobs');
    }
    const job = await this.jobRepository.findOne({
      where: { id: jobId, employer: { id: employer.id } },
      relations: ['employer'],
    });
    if (!job) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    Object.assign(job, updateJobDto);
    const updatedJob = await this.jobRepository.save(job);

    return returnResponse(200, SUCCESS_MESSAGES.JOB_UPDATED, updatedJob);
  }

  async deleteJob(
    employer: UserDto,
    jobId: number,
  ): Promise<ApiResponse<JobDto>> {
    if (employer.role !== 'employer') {
      throw new ForbiddenException('Only employers can delete jobs');
    }
    const job = await this.jobRepository.findOne({
      where: { id: jobId, employer: { id: employer.id } },
    });
    if (!job) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
    await this.jobRepository.remove(job);
    return returnResponse(200, SUCCESS_MESSAGES.JOB_DELETED);
  }
}
