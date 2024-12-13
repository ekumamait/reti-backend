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

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    const job = this.jobRepository.create({
      ...createJobDto,
      employer: employer,
    });
    const savedJob = await this.jobRepository.save(job);
    return returnResponse(201, SUCCESS_MESSAGES.JOB_CREATED, savedJob);
  }

  async getAllJobs(): Promise<ApiResponse<JobDto[]>> {
    const jobs = await this.jobRepository.find({ relations: ['employer'] });
    return returnResponse(200, SUCCESS_MESSAGES.JOBS_FOUND, jobs);
  }

  async getEmployerJobs(employerId: number): Promise<ApiResponse<JobDto[]>> {
    const jobs = await this.jobRepository.find({
      where: { employer: { id: employerId } },
      relations: ['employer'],
    });
    return returnResponse(200, SUCCESS_MESSAGES.JOBS_FOUND, jobs);
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
