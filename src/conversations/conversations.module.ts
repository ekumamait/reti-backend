import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { Conversation } from '../database/entities/conversation.entity';
import { User } from '../database/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Profile } from 'src/database/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Profile])],
  providers: [ConversationsService, UsersService],
  controllers: [ConversationsController],
  exports: [ConversationsService],
})
export class ConversationsModule {}
