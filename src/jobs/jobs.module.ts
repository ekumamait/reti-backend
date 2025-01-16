import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from 'src/database/entities/job.entity';
import { User } from 'src/database/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User]), NotificationsModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
