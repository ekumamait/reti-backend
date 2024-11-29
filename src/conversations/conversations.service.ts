import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from '../database/entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from '../database/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { ConversationDto } from './dto/conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getConversationMessages(
    conversationId: number,
  ): Promise<ApiResponse<Conversation>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['messages', 'messages.sender', 'messages.receiver'],
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.CONVERSATION_NOT_FOUND(conversationId),
      );
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.CONVERSATION_FOUND(conversationId),
      conversation,
    );
  }

  async getUserConversations(
    userId: number,
  ): Promise<ApiResponse<ConversationDto[]>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_ID_NOT_FOUND(userId));
    }

    const conversations = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.user1', 'user1')
      .leftJoinAndSelect('conversation.user2', 'user2')
      .where(
        'conversation.user1id = :userId OR conversation.user2id = :userId',
        { userId },
      )
      .getMany();

    const conversationDtos: ConversationDto[] = conversations.map(
      (conversation) => ({
        id: conversation.id,
        user1: {
          id: conversation.user1.id,
          firstName: conversation.user1.firstName,
          lastName: conversation.user1.lastName,
          email: conversation.user1.email,
        },
        user2: {
          id: conversation.user2.id,
          firstName: conversation.user2.firstName,
          lastName: conversation.user2.lastName,
          email: conversation.user2.email,
        },
      }),
    );

    return returnResponse(
      200,
      SUCCESS_MESSAGES.CONVERSATIONS_FOUND,
      conversationDtos,
    );
  }
}
