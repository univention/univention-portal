import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'the notification ID (uuid)'
  })
  id: string;

  @ApiProperty({
    description: 'The source DN (uuid) of the application'
  })
  appId: string;

  @ApiProperty({
    description: 'The target DN (uuid), can be a user, a group or all'
  })
  target: string;

  @ApiProperty({
    description: 'The title of the notification'
  })
  title: string;

  @ApiPropertyOptional({
    description: 'The notification message, shown when notification details are to be shown'
  })
  message: string;

  @ApiPropertyOptional({
    description: 'A theme the notification can appear in'
  })
  severity: NotificationSeverity;

  @ApiProperty({
    description: 'The time this notification was sent (to be provided by the application)'
  })
  sendTime: string;

  @ApiPropertyOptional({
    description: 'The time at which this notification will expire and delete itself fully'
  })
  expireTime: string;

  @ApiProperty({
    description: 'A boolean that represents if this notification should appear fixed at the top and is not closable/readable'
  })
  sticky: boolean;

  @ApiProperty({
    description: 'A boolean that represents wether this notification needs to be confirmed by the user'
  })
  needsConfirmation: boolean;

  @ApiProperty({
    description: 'Will control further discrimination'
  })
  type: NotificationType;
}

export enum NotificationSeverity {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error'
}

export enum NotificationType {
    Event = 'event', 
    Announcement = 'announcement', 
    Alert = 'alert', 
    Call = 'call'
};


/* 
open questions/points

- additional API for setting read, confirmed and received times
  - when is a notification received?
- ORMing
  - finding out how enums are mapped

*/