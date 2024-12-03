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
    createConversationDto: CreateConversationDto,
  ): Promise<ApiResponse<Conversation>> {
    const { messages } = createConversationDto;
    const userIds = Array.from(
      new Set(messages.flatMap((msg) => [msg.senderId, msg.receiverId])),
    );

    const users = await this.userRepository.findBy({ id: In(userIds) });
    if (users.length !== userIds.length) {
      throw new NotFoundException('One or more users not found');
    }

    const userMap = new Map(
      users.map((user) => [user.id, `${user.firstName} ${user.lastName}`]),
    );

    const detailedMessages = messages.map((message, index) => ({
      ...message,
      id: message.id ?? Date.now() + index,
      timestamp: message.timestamp ?? new Date(),
      read: message.read ?? false,
      sender: userMap.get(message.senderId),
      receiver: userMap.get(message.receiverId),
    }));

    const existingConversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where(
        'conversation.messages @> :message1 OR conversation.messages @> :message2',
        {
          message1: JSON.stringify([
            { senderId: userIds[0], receiverId: userIds[1] },
          ]),
          message2: JSON.stringify([
            { senderId: userIds[1], receiverId: userIds[0] },
          ]),
        },
      )
      .getOne();
    if (existingConversation) {
      console.log('>>>>', existingConversation.messages);
      existingConversation.messages.push(...detailedMessages);
      await this.conversationRepository.save(existingConversation);

      return returnResponse(
        200,
        SUCCESS_MESSAGES.MESSAGE_SENT,
        existingConversation,
      );
    }
    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      messages: detailedMessages,
    });
    await this.conversationRepository.save(conversation);
    return returnResponse(
      200,
      SUCCESS_MESSAGES.CONVERSATION_CREATED,
      conversation,
    );
  }

  async getConversationMessages(
    conversationId: number,
  ): Promise<ApiResponse<Conversation>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
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
  ): Promise<ApiResponse<Conversation[]>> {
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
  ): Promise<ApiResponse<Conversation>> {
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

    message.read = true;

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
  ): Promise<ApiResponse<Conversation>> {
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
  ): Promise<ApiResponse<Conversation>> {
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
