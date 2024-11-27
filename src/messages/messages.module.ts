import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message } from '../database/entities/message.entity';
import { Conversation } from '../database/entities/conversation.entity';
import { User } from '../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation, User])],
  providers: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
