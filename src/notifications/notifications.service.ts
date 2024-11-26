import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    return this.notificationsRepository.save(notification);
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
