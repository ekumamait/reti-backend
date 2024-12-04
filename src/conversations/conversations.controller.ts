import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Request,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { ConversationDto } from './dto/conversation.dto';
import { RequestWithUser } from 'src/common/types/types';

@ApiTags('v1/conversations')
@Controller({ path: 'conversations', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createConversation(
    @Request() req: RequestWithUser,
    @Body() createConversationDto: CreateConversationDto,
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.createConversation(
      req.user.id,
      createConversationDto,
    );
  }

  @Get('user')
  async getUserConversations(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ConversationDto[]>> {
    return this.conversationsService.getUserConversations(req.user.id);
  }

  @Patch(':conversationId/messages/:messageId/read')
  async markMessageAsRead(
    @Param('conversationId') conversationId: number,
    @Param('messageId') messageId: number,
  ): Promise<ApiResponse<ConversationDto>> {
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
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.editMessage(
      conversationId,
      messageId,
      newContent,
    );
  }

  @Delete(':conversationId')
  async deleteConversation(
    @Param('conversationId') conversationId: number,
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.deleteConversation(conversationId);
  }
}
