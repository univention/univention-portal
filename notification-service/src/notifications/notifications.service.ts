import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepository: Repository<Notification>,
    ) {}

  async create(notification: CreateNotificationDto) {
    notification['receiveTime'] = new Date().toISOString();
    await this.notificationsRepository.insert(notification);
  }

  findAll() {
    return this.notificationsRepository.find();
  }

  findOne(id: string): Promise<Notification> {
    return this.notificationsRepository.findOneBy({ id });
  }
  
  async remove(id: string): Promise<void> {
    await this.notificationsRepository.delete(id);
  }
  
  async markRead(id: string) {
    await this.notificationsRepository.update(
      { id },
      { readTime: new Date().toISOString() }
    )
  }

  async confirm(id: string) {
    await this.notificationsRepository.update(
      { id },
      { confirmationTime: new Date().toISOString() }
    )
  }
}
