import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../authentication/auth.module';
import { MentorshipSession } from '../database/entities/mentorship-session.entity';
import { MentorshipSessionsService } from './mentorship-sessions.service';
import { MentorshipSessionsController } from './mentorship-sessions.controller';
import { InspirationsModule } from '../inspirations/inspirations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorshipSession]),
    UsersModule,
    AuthModule,
    InspirationsModule,
  ],
  controllers: [MentorshipSessionsController],
  providers: [MentorshipSessionsService],
  exports: [MentorshipSessionsService],
})
export class MentorshipSessionsModule {}
