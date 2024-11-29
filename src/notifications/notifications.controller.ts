import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response.util';
import { Notification } from '../database/entities/notification.entity';

@ApiTags('v1/notifications')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  async findAll(@Request() req): Promise<ApiResponse<Notification[]>> {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.findOne(+id, req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.markAsRead(+id, req.user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.delete(+id, req.user.id);
  }

  @Delete()
  async deleteAll(@Request() req): Promise<ApiResponse<Notification[]>> {
    return this.notificationsService.deleteAll(req.user.id);
  }
}
