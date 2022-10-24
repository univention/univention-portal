import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationSeverity, NotificationType } from './dto/create-notification.dto';
 
@Entity()
export class Notification {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  appId: string;

  @Column()
  target: string;

  @Column()
  title: string;

  @Column({
    nullable: true
  })
  message: string;

  @Column({
    nullable: true
  })
  severity: NotificationSeverity;

  @Column()
  sendTime: string;

  @Column()
  receiveTime: string;

  @Column({
    nullable: true
  })
  readTime: string;
  
  @Column({
    nullable: true
  })
  confirmationTime: string;

  @Column({
    nullable: true
  })
  expireTime: string;

  @Column()
  sticky: boolean;

  @Column()
  needsConfirmation: boolean;

  @Column()
  type: NotificationType;
}
