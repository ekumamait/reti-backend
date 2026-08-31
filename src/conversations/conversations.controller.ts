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
import { EditMessageDto } from './dto/edit-message.dto';
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

  @Patch(':id/read')
  async markMessageAsRead(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.markMessagesAsRead(id, req.user.id);
  }

  @Patch(':id/messages/:messageId')
  async editMessage(
    @Param('id') id: number,
    @Param('messageId') messageId: number,
    @Body() editMessageDto: EditMessageDto,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.editMessage(
      id,
      messageId,
      editMessageDto.content,
      req.user.id,
    );
  }

  @Get(':id/messages')
  async getConversationMessages(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<any>> {
    return this.conversationsService.getConversationMessages(id, req.user.id);
  }

  @Delete(':id')
  async deleteConversation(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<ConversationDto>> {
    return this.conversationsService.deleteConversation(id, req.user.id);
  }
}
