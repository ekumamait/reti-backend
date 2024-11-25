import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('v1/conversations')
@Controller({ path: 'conversations', version: '1' })
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
  ) {
    return this.conversationsService.createConversation(createConversationDto);
  }

  @Get(':id/messages')
  async getConversationMessages(@Param('id') id: number) {
    return this.conversationsService.getConversationMessages(id);
  }
}
