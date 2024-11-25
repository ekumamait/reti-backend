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

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto, @Request() req) {
    return this.notificationsService.create({
      ...createNotificationDto,
      userId: req.user.id,
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
  remove(@Param('id') id: string, @Request() req) {
    return this.notificationsService.remove(+id, req.user.id);
  }

  @Delete()
  removeAll(@Request() req) {
    return this.notificationsService.removeAll(req.user.id);
  }
}
