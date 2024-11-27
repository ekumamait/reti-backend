import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { Conversation } from 'src/database/entities/conversation.entity';

@ApiTags('v1/conversations')
@Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(':id/messages')
  async getConversationMessages(
    @Param('id') id: number,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.getConversationMessages(id);
  }
}
