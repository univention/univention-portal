import * as models from '@/store/modules/notifications/notifications.models';

export const stubFullNotification: models.FullNotification = {
  hidingAfter: 4,
  importance: 'default',
  onClick: () => null,
  title: 'Stub Notification Title',
  token: '4eeec048-a8b0-4a36-a3be-16722ad39acd',
  visible: true,
};

export const stubUuid = 'fef230ec-fe26-4541-a4d3-4ee40a1d14e6';
