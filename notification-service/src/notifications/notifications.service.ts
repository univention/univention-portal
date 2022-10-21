import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private dataSource: DataSource,
  ) {}

  async create(notification: CreateNotificationDto) {
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
}
