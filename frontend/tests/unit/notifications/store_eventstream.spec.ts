import notificationsApi, { connectEventSource } from '@/store/modules/notifications/apiclient';

import * as stubs from './stubs';
import * as utils from '../utils';

jest.mock('@/store/modules/notifications/apiclient');

afterEach(() => {
  jest.resetAllMocks();
});

describe('connectNotificationsApi', () => {

  beforeEach(() => {
    const stubResponse = {
      data: [],
    };
    utils.mockReturnValue(notificationsApi.getNotificationsV1NotificationsGet, stubResponse);
  });

  test('loads initial notifications from the api', async () => {
    const stubStore = stubs.store();
    await stubStore.dispatch('notifications/connectNotificationsApi');
    expect(notificationsApi.getNotificationsV1NotificationsGet).toHaveBeenCalledWith();
  });

  test('connects the event stream', async () => {
    const stubStore = stubs.store();
    await stubStore.dispatch('notifications/connectNotificationsApi');
    expect(connectEventSource).toHaveBeenCalledWith();
  });

  test('adds EventSource instance into state', async () => {
    const stubStore = stubs.store();
    const stubEventSource = { _flagStubEventSource: true };
    (connectEventSource as jest.Mock).mockReturnValue(stubEventSource);
    await stubStore.dispatch('notifications/connectNotificationsApi');
    expect(stubStore.state.notifications.eventSource).toEqual(stubEventSource);
  });
});
