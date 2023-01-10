import vuex from 'vuex';

import notifications from '@/store/modules/notifications';
import notificationsApi from '@/store/modules/notifications/apiclient';

import * as utils from '../utils';

jest.mock('@/store/modules/notifications/apiclient');

afterEach(() => {
  jest.resetAllMocks();
});

describe('connectNotificationsApi', () => {

  test('loads initial notifications from the api', async () => {
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
    const stubResponse = {
      data: [],
    };
    utils.mockReturnValue(notificationsApi.getNotificationsV1NotificationsGet, stubResponse);
    await stubStore.dispatch('notifications/connectNotificationsApi');
    expect(notificationsApi.getNotificationsV1NotificationsGet).toHaveBeenCalledWith();
  });
});
