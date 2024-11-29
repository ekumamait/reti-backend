import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Message } from '../database/entities/message.entity';
import { Conversation } from '../database/entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../database/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { MarkMessagesReadDto } from './dto/MarkMessagesReadDto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<ApiResponse<Message>> {
    const { senderId, receiverId, content } = createMessageDto;

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) {
      throw new NotFoundException(ERROR_MESSAGES.PARTICIPANTS_NOT_FOUND);
    }

    // Check if a conversation between the users exists
    let conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .where(
        '(conversation.user1id = :senderId AND conversation.user2id = :receiverId) OR (conversation.user1id = :receiverId AND conversation.user2id = :senderId)',
        { senderId, receiverId },
      )
      .getOne();

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = this.conversationRepository.create({
        user1: sender,
        user2: receiver,
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    // Create and save the message
    const message = this.messageRepository.create({
      sender,
      receiver,
      conversation,
      content,
    });

    const savedMessage = await this.messageRepository.save(message);
    return returnResponse(200, SUCCESS_MESSAGES.MESSAGE_SENT, savedMessage);
  }

  async getConversationMessages(
    conversationId: number,
  ): Promise<ApiResponse<Message[]>> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['messages', 'messages.sender', 'messages.receiver'],
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.MESSAGE_NOT_FOUND(conversationId),
      );
    }

    return returnResponse(
      200,
      SUCCESS_MESSAGES.MESSAGES_FOUND,
      conversation.messages,
    );
  }

  async markMessagesAsRead(
    markMessagesReadDto: MarkMessagesReadDto,
  ): Promise<ApiResponse<void>> {
    const { messageIds } = markMessagesReadDto;

    await this.messageRepository.update({ id: In(messageIds) }, { read: true });

    return returnResponse(200, SUCCESS_MESSAGES.MESSAGES_MARKED_AS_READ);
  }
}
