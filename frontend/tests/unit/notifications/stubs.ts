import vuex from 'vuex';

import { Notification as BackendNotification, NotificationSeverity } from '@/apis/notifications';
import notifications from '@/store/modules/notifications';
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

export const stubBackendNotification: BackendNotification = {
  id: 'cd7e52fb-922c-4255-b727-c8d42c1b1f32',
  sourceUid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  targetUid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'Example notification',
  details: 'string',
  notificationType: 'event',
  severity: 'info',
  receiveTime: '2023-01-07T09:47:07.789861',
  popup: true,

  // optional attributes
  sticky: undefined,
  needsConfirmation: undefined,
  data: undefined,
  readTime: undefined,
  sseSendTime: undefined,
  confirmationTime: undefined,
  expireTime: undefined,
};

export const stubTime = '2023-01-08T09:47:07.789861';

export const store = function () {
  const stubStore = new vuex.Store<any>({
    modules: {
      notifications: {
        ...notifications,
        state: {
          notifications: [],
          backendNotifications: [],
        },
      },
    },
  });
  return stubStore;
};

export const eventSource = function () {
  return {
    addEventListener: jest.fn(),
  };
};
