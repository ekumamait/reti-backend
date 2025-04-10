import { Module } from '@nestjs/common';
import { JobEmailService } from './opportunity.service';
import { JobEmailController } from './opportunity.controller';
import { ProfileModule } from 'src/profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplication } from 'src/database/entities/job-applications.entity';
import { SharedApplication } from 'src/database/entities/shared-applications.entity';
import { Job } from 'src/database/entities/job.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplication, SharedApplication, Job]),
    ProfileModule,
  ],
  controllers: [JobEmailController],
  providers: [JobEmailService],
})
export class JobEmailModule {}
