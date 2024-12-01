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

  async findAll(userId: number): Promise<ApiResponse<Notification[]>> {
    const notifications = await this.notificationsRepository.find({
      where: { userId },
    });
    return returnResponse(
      200,
      'Notifications fetched successfully',
      notifications,
    );
  }

  async findOne(
    id: number,
    userId: number,
  ): Promise<ApiResponse<Notification>> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found`);
    }
    return returnResponse(
      200,
      `Notification #${id} fetched successfully`,
      notification,
    );
  }

  async markAsRead(
    id: number,
    userId: number,
  ): Promise<ApiResponse<Notification>> {
    const notification = await this.findOne(id, userId);
    const updatedNotification = await this.notificationsRepository.save({
      ...notification.data,
      isRead: true,
    });
    return returnResponse(
      200,
      `Notification #${id} marked as read`,
      updatedNotification,
    );
  }

  async delete(id: number, userId: number): Promise<ApiResponse<Notification>> {
    const notification = await this.findOne(id, userId);
    const deletedNotification = await this.notificationsRepository.remove(
      notification.data,
    );
    return returnResponse(
      200,
      `Notification #${id} deleted successfully`,
      deletedNotification,
    );
  }

  async deleteAll(userId: number): Promise<ApiResponse<Notification[]>> {
    const notifications = await this.findAll(userId);
    const deletedNotifications = await this.notificationsRepository.remove(
      notifications.data,
    );
    return returnResponse(
      200,
      'All notifications deleted successfully',
      deletedNotifications,
    );
  }
}
