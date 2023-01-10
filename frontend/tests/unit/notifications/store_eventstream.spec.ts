import notificationsApi, { connectEventSource } from '@/store/modules/notifications/apiclient';

import * as stubs from './stubs';
import * as utils from '../utils';

jest.mock('@/store/modules/notifications/apiclient');

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
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

describe('newBackendNotificationEvent', () => {

  test('adds a new backend notification into the state', () => {
    const stubStore = stubs.store();
    const eventData = stubs.stubBackendNotification;
    stubStore.dispatch('notifications/newBackendNotificationEvent', eventData);
    expect(stubStore.state.notifications.backendNotifications).toHaveLength(1);
  });

  test('does not add a known notification into the state', () => {
    const warnMock = jest.spyOn(console, 'warn');
    const stubStore = stubs.store();
    const eventData = stubs.stubBackendNotification;
    stubStore.dispatch('notifications/newBackendNotificationEvent', eventData);
    stubStore.dispatch('notifications/newBackendNotificationEvent', eventData);
    expect(stubStore.state.notifications.backendNotifications).toHaveLength(1);
    expect(warnMock).toHaveBeenCalled();
  });

});

describe('deleteBackendNotificationEvent', () => {

  test('removes a backend notification from the store', () => {
    const stubStore = stubs.store();
    const eventData = {
      id: stubs.stubBackendNotification.id,
    };

    // TODO: Refactor: Allow to inject state into stubs.store()
    stubStore.dispatch('notifications/newBackendNotificationEvent', stubs.stubBackendNotification);
    expect(stubStore.state.notifications.backendNotifications).toHaveLength(1);

    stubStore.dispatch('notifications/deleteBackendNotificationEvent', eventData);
    expect(stubStore.state.notifications.backendNotifications).toHaveLength(0);
  });

  test('does ignore an event for a non existing backend notification', () => {
    const warnMock = jest.spyOn(console, 'warn');
    const stubStore = stubs.store();
    const eventData = {
      id: stubs.stubBackendNotification.id,
    };
    stubStore.dispatch('notifications/deleteBackendNotificationEvent', eventData);
    expect(stubStore.state.notifications.backendNotifications).toHaveLength(0);
    expect(warnMock).toHaveBeenCalled();
  });

});
