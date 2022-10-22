import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationSeverity, NotificationType } from './dto/create-notification.dto';
 
@Entity()
export class Notification {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  appId: string;

  @Column()
  target: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  severity: NotificationSeverity;

  @Column()
  sendTime: string;

  @Column()
  receiveTime: string;

  @Column()
  readTime: string;
  
  @Column()
  confirmationTime: string;

  @Column()
  expireTime: string;

  @Column()
  sticky: boolean;

  @Column()
  needsConfirmation: boolean;

  @Column()
  type: NotificationType;
}
