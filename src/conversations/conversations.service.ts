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

  async createConversation(
    userId: number,
    createConversationDto: CreateConversationDto,
  ): Promise<ApiResponse<ConversationDto>> {
    const { messages } = createConversationDto;
    const receiverId = messages[0].receiverId;

    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }
    console.log(userId, receiverId);

    if (userId === receiverId) {
      throw new NotFoundException(ERROR_MESSAGES.SENDER_RECEIVER_SAME(userId));
    }

    const detailedMessages = messages.map((message, index) => ({
      ...message,
      senderId: userId,
      id: message.id ?? Date.now() + index,
      createdAt: message.createdAt ?? new Date(),
      isRead: message.isRead ?? false,
    }));

    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where(
        'conversation.messages @> :message1 OR conversation.messages @> :message2',
        {
          message1: JSON.stringify([{ senderId: userId, receiverId }]),
          message2: JSON.stringify([{ senderId: userId, receiverId }]),
        },
      )
      .getOne();
    if (existingConversation) {
      existingConversation.messages.push(...detailedMessages);
      const updatedConversation = await this.conversationRepository.save(
        existingConversation,
      );

      return returnResponse(
        200,
        SUCCESS_MESSAGES.MESSAGE_SENT,
        updatedConversation,
      );
    }
    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      messages: detailedMessages,
    });
    const savedConversation = await this.conversationRepository.save(
      conversation,
    );
    return returnResponse(
      201,
      SUCCESS_MESSAGES.CONVERSATION_CREATED,
      savedConversation,
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
      .where('conversation.messages @> :message', {
        message: JSON.stringify([{ senderId: userId }]),
      })
      .orWhere('conversation.messages @> :message', {
        message: JSON.stringify([{ receiverId: userId }]),
      })
      .getMany();

    return returnResponse(
      200,
      SUCCESS_MESSAGES.CONVERSATIONS_FOUND,
      conversations,
    );
  }

  async markMessageAsRead(
    conversationId: number,
    messageId: number,
  ): Promise<ApiResponse<ConversationDto>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.CONVERSATION_NOT_FOUND(conversationId),
      );
    }

    const message = conversation.messages.find((msg) => msg.id === messageId);
    if (!message) {
      throw new NotFoundException(ERROR_MESSAGES.MESSAGE_NOT_FOUND(messageId));
    }

    message.isRead = true;

    conversation.messages = conversation.messages.map((msg) =>
      msg.id === messageId ? message : msg,
    );

    await this.conversationRepository.save(conversation);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.MESSAGES_MARKED_AS_READ,
      conversation,
    );
  }

  async editMessage(
    conversationId: number,
    messageId: number,
    newContent: string,
  ): Promise<ApiResponse<ConversationDto>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.CONVERSATION_NOT_FOUND(conversationId),
      );
    }

    const message = conversation.messages.find((msg) => msg.id === messageId);
    if (!message) {
      throw new NotFoundException(ERROR_MESSAGES.MESSAGE_NOT_FOUND(messageId));
    }

    message.content = newContent;

    conversation.messages = conversation.messages.map((msg) =>
      msg.id === messageId ? message : msg,
    );

    await this.conversationRepository.save(conversation);
    return returnResponse(200, SUCCESS_MESSAGES.MESSAGE_UPDATED, conversation);
  }

  async deleteConversation(
    conversationId: number,
  ): Promise<ApiResponse<ConversationDto>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.CONVERSATION_NOT_FOUND(conversationId),
      );
    }

    await this.conversationRepository.delete(conversationId);

    return returnResponse(
      200,
      SUCCESS_MESSAGES.CONVERSATION_DELETED(conversationId),
    );
  }
}
