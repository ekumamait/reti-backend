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

@ApiTags('v1/notifications')
@Controller({ path: 'notifications', version: '1' })
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto, @Request() req) {
    return this.notificationsService.create({
      ...createNotificationDto,
    });
  }

  @Get()
  findAll(@Request() req) {
    return this.notificationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.notificationsService.findOne(+id, req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(+id, req.user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.notificationsService.delete(+id, req.user.id);
  }

  @Delete()
  deleteAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.id);
  }
}
