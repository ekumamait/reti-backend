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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { JobDto } from './dto/job.dto';
import { RequestWithUser } from 'src/common/types/types';
import { JobQueryDto } from './dto/job-query.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@ApiTags('v1/jobs')
@Controller({ path: 'jobs', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(
    @Body() createJobDto: CreateJobDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<JobDto>> {
    return this.jobsService.createJob(req.user, createJobDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllJobs(
    @Query() query: JobQueryDto,
  ): Promise<ApiResponse<JobDto[]>> {
    return this.jobsService.getAllJobs(query);
  }

  @Get('employer/:employerId')
  @UseGuards(JwtAuthGuard)
  async getEmployerJobs(
    @Param('employerId', ParseIntPipe) employerId: number,
    @Query() query: JobQueryDto,
  ): Promise<ApiResponse<JobDto[]>> {
    return this.jobsService.getEmployerJobs(employerId, query);
  }

  @Get(':id')
  async getOneJob(@Param('id') id: number): Promise<ApiResponse<JobDto>> {
    return this.jobsService.getOneJob(id);
  }

  @Patch(':id')
  async updateJob(
    @Param('id') jobId: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<JobDto>> {
    return this.jobsService.updateJob(req.user, jobId, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(
    @Param('id') jobId: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<JobDto>> {
    return this.jobsService.deleteJob(req.user, jobId);
  }
}
