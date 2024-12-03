import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { Conversation } from 'src/database/entities/conversation.entity';

@ApiTags('v1/conversations')
@Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createConversation(
    @Body() createConveersationDto: CreateConversationDto,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.createConversation(createConveersationDto);
  }

  @Get(':id/messages')
  async getConversationMessages(
    @Param('id') id: number,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.getConversationMessages(id);
  }

  @Get('user/:userId')
  async getUserConversations(
    @Param('userId') userId: number,
  ): Promise<ApiResponse<Conversation[]>> {
    return this.conversationsService.getUserConversations(userId);
  }

  @Patch(':conversationId/messages/:messageId/read')
  async markMessageAsRead(
    @Param('conversationId') conversationId: number,
    @Param('messageId') messageId: number,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.markMessageAsRead(
      conversationId,
      messageId,
    );
  }

  @Patch(':conversationId/messages/:messageId')
  async editMessage(
    @Param('conversationId') conversationId: number,
    @Param('messageId') messageId: number,
    @Body('content') newContent: string,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.editMessage(
      conversationId,
      messageId,
      newContent,
    );
  }

  @Delete(':conversationId')
  async deleteConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<ApiResponse<Conversation>> {
    return this.conversationsService.deleteConversation(conversationId);
  }
}
