import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { returnResponse, ApiResponse } from '../common/response.util';
import { NotificationQueryDto } from './dto/notification-query.dto';
import {
  PaginatedResponse,
  getPaginationParams,
  createPaginatedResponse,
} from '../common/pagination.util';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<ApiResponse<Notification>> {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    const savedNotification = await this.notificationsRepository.save(
      notification,
    );
    return returnResponse(
      201,
      'Notification created successfully',
      savedNotification,
    );
  }

  async findAll(
    userId: number,
    query?: NotificationQueryDto,
  ): Promise<PaginatedResponse<Notification>> {
    const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(
      query || {},
    );

    const [notifications, total] =
      await this.notificationsRepository.findAndCount({
        where: { userId },
        skip,
        take: limit,
        order: { [sortBy]: sortOrder },
      });

    return createPaginatedResponse(
      200,
      'Notifications fetched successfully',
      notifications,
      total,
      page,
      limit,
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
      throw new NotFoundException('Notification not found');
    }

    return returnResponse(
      200,
      'Notification fetched successfully',
      notification,
    );
  }

  async markAsRead(
    id: number,
    userId: number,
  ): Promise<ApiResponse<Notification>> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.isRead = true;
    const updatedNotification = await this.notificationsRepository.save(
      notification,
    );
    return returnResponse(
      200,
      'Notification marked as read',
      updatedNotification,
    );
  }

  async delete(id: number, userId: number): Promise<ApiResponse<Notification>> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationsRepository.remove(notification);
    return returnResponse(
      200,
      'Notification deleted successfully',
      notification,
    );
  }

  async deleteAll(userId: number): Promise<ApiResponse<Notification[]>> {
    const notifications = await this.notificationsRepository.find({
      where: { userId },
    });

    if (!notifications.length) {
      throw new NotFoundException('No notifications found');
    }

    await this.notificationsRepository.remove(notifications);
    return returnResponse(
      200,
      'All notifications deleted successfully',
      notifications,
    );
  }
}
