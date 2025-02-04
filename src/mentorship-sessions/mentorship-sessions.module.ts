import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../authentication/auth.module';
import { User } from 'src/database/entities/user.entity';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { MentorshipSessionsService } from './mentorship-sessions.service';
import { MentorshipSessionsController } from './mentorship-sessions.controller';
import { InspirationsModule } from '../inspirations/inspirations.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorshipSession, User]),
    UsersModule,
    AuthModule,
    InspirationsModule,
    NotificationsModule,
  ],
  controllers: [MentorshipSessionsController],
  providers: [MentorshipSessionsService],
  exports: [MentorshipSessionsService],
})
export class MentorshipSessionsModule {}
