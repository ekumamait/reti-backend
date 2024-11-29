import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { Message } from 'src/database/entities/message.entity';
import { MarkMessagesReadDto } from './dto/MarkMessagesReadDto';

@ApiTags('v1/messages')
@Controller({ path: 'messages', version: '1' })
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ApiResponse<Message>> {
    return this.messagesService.sendMessage(createMessageDto);
  }

  @Get('conversation/:id')
  async getConversationMessages(
    @Param('id') id: number,
  ): Promise<ApiResponse<Message[]>> {
    return this.messagesService.getConversationMessages(id);
  }

  @Patch('read')
  async markMessagesAsRead(
    @Body() markMessagesReadDto: MarkMessagesReadDto,
  ): Promise<ApiResponse<void>> {
    return this.messagesService.markMessagesAsRead(markMessagesReadDto);
  }
}
