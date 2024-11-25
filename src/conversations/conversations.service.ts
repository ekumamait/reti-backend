import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { User } from '../users/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createConversation(
    createConversationDto: CreateConversationDto,
  ): Promise<{ conversation: Conversation; successMessage: string }> {
    const participants = await this.userRepository.findBy({
      id: In(createConversationDto.participantIds),
    });
    if (participants.length !== createConversationDto.participantIds.length) {
      throw new NotFoundException(ERROR_MESSAGES.PARTICIPANTS_NOT_FOUND);
    }

    const conversation = this.conversationRepository.create({ participants });
    const savedConversation = await this.conversationRepository.save(
      conversation,
    );
    return {
      successMessage: SUCCESS_MESSAGES.CONVERSATION_CREATED,
      conversation: savedConversation,
    };
  }

  async getConversationMessages(
    conversationId: number,
  ): Promise<{ conversation: Conversation; successMessage: string }> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['messages', 'messages.sender', 'messages.receiver'],
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.CONVERSATION_NOT_FOUND(conversationId),
      );
    }

    return {
      successMessage: SUCCESS_MESSAGES.CONVERSATION_FOUND(conversationId),
      conversation,
    };
  }
}
