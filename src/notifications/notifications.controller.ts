import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponse } from '../common/pagination.util';
import { Notification } from '../database/entities/notification.entity';
import { RequestWithUser } from '../common/types/types';
import { ApiResponse } from '../common/response.util';

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
  async findAll(
    @Request() req: RequestWithUser,
  ): Promise<PaginatedResponse<Notification>> {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.findOne(id, req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Notification>> {
    return this.notificationsService.delete(id, req.user.id);
  }

  @Delete()
  async removeAll(
    @Request() req: RequestWithUser,
  ): Promise<ApiResponse<Notification[]>> {
    return this.notificationsService.deleteAll(req.user.id);
  }
}
