import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';

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
  ): Promise<{ message: Message; successMessage: string }> {
    const { senderId, receiverId, conversationId, content } = createMessageDto;

    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!sender || !receiver || !conversation) {
      throw new NotFoundException(ERROR_MESSAGES.PARTICIPANTS_NOT_FOUND);
    }

    const message = this.messageRepository.create({
      sender,
      receiver,
      conversation,
      content,
    });

    const savedMessage = await this.messageRepository.save(message);
    return {
      successMessage: SUCCESS_MESSAGES.MESSAGE_SENT,
      message: savedMessage,
    };
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['messages', 'messages.sender', 'messages.receiver'],
    });

    if (!conversation) {
      throw new NotFoundException(
        ERROR_MESSAGES.MESSAGE_NOT_FOUND(conversationId),
      );
    }

    return conversation.messages;
  }
}
