import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiResponse, returnResponse } from 'src/common/response.util';
import { User } from 'src/database/entities/user.entity';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from 'src/common/constants';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    const user = await this.userRepository.findOne({
      where: { id: createNotificationDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        ERROR_MESSAGES.USER_ID_NOT_FOUND(createNotificationDto.userId),
      );
    }
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );

    const savedNotification = await this.notificationsRepository.save(
      notification,
    );
    return returnResponse(
      201,
      SUCCESS_MESSAGES.NOTIFICATION_CREATED,
      savedNotification,
    );
  }

  findAll(userId: number) {
    return this.notificationsRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found`);
    }
    return notification;
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.findOne(id, userId);
    notification.isRead = true;
    return this.notificationsRepository.save(notification);
  }

  async delete(id: number, userId: number) {
    const notification = await this.findOne(id, userId);
    return this.notificationsRepository.remove(notification);
  }

  async deleteAll(userId: number) {
    const notifications = await this.findAll(userId);
    return this.notificationsRepository.remove(notifications);
  }
}
