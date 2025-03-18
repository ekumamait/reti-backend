import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendOpportunityEmailDto } from './dto/send-opportunity-email.dto';
import { ShareProfileEmailDto } from './dto/share-profileEmail.dto';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { generateProfilePDF } from 'src/utils/generate-profile-pdf';
import * as fs from 'fs';
import { ProfileService } from 'src/profile/profile.service';
import { ERROR_MESSAGES } from 'src/common/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from 'src/database/entities/job-applications.entity';
import { SharedApplication } from 'src/database/entities/shared-applications.entity';
import { Repository } from 'typeorm';
import { Job } from 'src/database/entities/job.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Express } from 'express';

@Injectable()
export class JobEmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly profileService: ProfileService,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(SharedApplication)
    private readonly sharedApplicationRepository: Repository<SharedApplication>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async sendOpportunityApplicationEmail(
    userId: number,
    emailDto: SendOpportunityEmailDto,
    file: Express.Multer.File,
  ): Promise<ApiResponse<SendOpportunityEmailDto>> {
    const job = await this.jobRepository.findOne({
      where: { id: emailDto.jobId },
      relations: ['employer'],
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${emailDto.jobId} not found.`);
    }
    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { userId, job: { id: emailDto.jobId } },
    });
    if (existingApplication) {
      throw new ConflictException('You have already applied for this job.');
    }
    const profileResponse = await this.profileService.findByUserId(userId);
    if (!profileResponse) {
      throw new NotFoundException(ERROR_MESSAGES.PROFILE_NOT_FOUND(userId));
    }

    const message = `Hello ${emailDto.employerName}, I am interested in the ${emailDto.jobTitle} position. 
Looking forward to your response. Thank you`;
    await this.mailerService.sendMail({
      to: emailDto.employerEmail,
      subject: `New Job Application: ${emailDto.jobTitle}`,
      template: 'opportunity-email',
      context: { ...emailDto, message },
      attachments: [
        {
          filename: `Applicant_Profile_${userId}.pdf`,
          content: file.buffer,
          contentType: 'application/pdf',
        },
      ],
    });
    const newApplication = this.jobApplicationRepository.create({
      userId,
      job: { id: emailDto.jobId },
    });
    await this.jobApplicationRepository.save(newApplication);

    await this.notificationsService.create({
      title: 'New Job Application',
      userId: job.employer.id,
      message: `${emailDto.applicantName} has applied for the job: ${emailDto.jobTitle}.`,
    });

    return returnResponse(201, 'Application email sent successfully');
  }

  async hasUserApplied(userId: number, jobId: number): Promise<boolean> {
    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { userId, job: { id: jobId } },
      relations: ['job'],
    });
    return !!existingApplication;
  }

  async shareProfileByEmail(
    userId: number,
    sharedEmailDto: ShareProfileEmailDto,
    file: Express.Multer.File,
  ): Promise<ApiResponse<any>> {
    const message = `Hello, Below I've attached my resume, kind regards. 
    Looking forward to your response. Thank you`;

    await this.mailerService.sendMail({
      to: sharedEmailDto.recipientEmail,
      subject: sharedEmailDto.subject || 'Shared Profile Application',
      template: 'shared-profile-email',
      context: { ...sharedEmailDto, message },
      attachments: [
        {
          filename: `Applicant_Profile_${userId}.pdf`,
          content: file.buffer,
          contentType: file.mimetype,
        },
      ],
    });

    await this.sharedApplicationRepository.save({
      userId,
      recipientEmail: sharedEmailDto.recipientEmail,
      sentAt: new Date(),
    });

    return returnResponse(201, 'Profile shared successfully');
  }
}
