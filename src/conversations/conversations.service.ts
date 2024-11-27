import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from '../database/entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from '../database/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { ApiResponse, returnResponse } from 'src/common/response.util';

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
}
