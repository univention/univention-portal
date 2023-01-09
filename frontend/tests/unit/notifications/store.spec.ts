import vuex from 'vuex';

import notifications, {
  actions, defaultHideAfter, getters, mapBackendNotification, mutations, severityMapping,
} from '@/store/modules/notifications';
import { stubBackendNotification, stubFullNotification, stubUuid } from './stubs';

test('title is set correctly', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.title).toBe(stubBackendNotification.title);
});

test('description is set correctly', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.description).toBe(stubBackendNotification.details);
});

test('hidingAfter is set correctly', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.hidingAfter).toBe(defaultHideAfter);
});

test.each(
  Object.entries(severityMapping),
)('importance is set correctly from severity(%s -> %s)', (severity: any, expected) => {
  const notification = {
    ...stubBackendNotification,
    severity,
  };
  const result = mapBackendNotification(notification);
  expect(result.importance).toBe(expected);
});

test.each([
  [true, true],
  [false, false],
  [false, undefined],
])('visible is set %s if popup is %s', (visible, popup) => {
  const stubNotification = {
    ...stubBackendNotification,
    popup,
  };
  const result = mapBackendNotification(stubNotification);
  expect(result.visible).toBe(visible);
});

test('token is set correctly', () => {
  const expectedTokenValue = stubBackendNotification.id;
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.token).toBe(expectedTokenValue);
});

test('backend notifications are flagged with isBackendNotification', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.isBackendNotification).toBe(true);
});

test('hideNotification commits HIDE_NOTIFICATION', () => {
  const actionContext = {
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: {
      allNotifications: [stubFullNotification],
    },
    rootState: {
      loadingState: false,
      initialLoadDone: true,
    },
    rootGetters: {},
    state: {
      notifications: [],
      backendNotifications: [],
    },
  };
  const token = stubFullNotification.token;
  actions.hideNotification(actionContext, token);
  expect(actionContext.commit).toHaveBeenCalledWith('HIDE_NOTIFICATION', stubFullNotification);
  expect(actionContext.commit).toHaveBeenCalledTimes(1);
});

test('hideNotification commits HIDE_BACKEND_NOTIFICATION', () => {
  const stubNotification = mapBackendNotification(stubBackendNotification);
  const actionContext = {
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: {
      allNotifications: [stubNotification],
    },
    rootState: {
      loadingState: false,
      initialLoadDone: true,
    },
    rootGetters: {},
    state: {
      notifications: [],
      backendNotifications: [stubBackendNotification],
    },
  };
  const token = stubNotification.token;
  actions.hideNotification(actionContext, token);
  expect(actionContext.commit).toHaveBeenCalledWith('HIDE_BACKEND_NOTIFICATION', stubBackendNotification);
  expect(actionContext.commit).toHaveBeenCalledTimes(1);
});

test('REMOVE_NOTIFICATION removes local notification', () => {
  const stubState = {
    notifications: [stubFullNotification],
    backendNotifications: [],
  };
  mutations.REMOVE_NOTIFICATION(stubState, stubFullNotification);
  expect(stubState.notifications).toHaveLength(0);
});

test('REMOVE_NOTIFICATION does not remove missing local notification', () => {
  const stubState = {
    notifications: [stubFullNotification],
    backendNotifications: [],
  };
  const otherFullNotification = {
    ...stubFullNotification,
    token: stubUuid,
  };
  mutations.REMOVE_NOTIFICATION(stubState, otherFullNotification);
  expect(stubState.notifications).toHaveLength(1);
});

test('REMOVE_BACKEND_NOTIFICATION does not remove missing backend notification', () => {
  const stubState = {
    notifications: [],
    backendNotifications: [stubBackendNotification],
  };
  const otherBackendNotification = {
    ...stubBackendNotification,
    id: stubUuid,
  };
  mutations.REMOVE_BACKEND_NOTIFICATION(stubState, otherBackendNotification);
  expect(stubState.backendNotifications).toHaveLength(1);
});

test('REMOVE_BACKEND_NOTIFICATION removes backend notification', () => {
  const stubState = {
    notifications: [],
    backendNotifications: [stubBackendNotification],
  };
  mutations.REMOVE_BACKEND_NOTIFICATION(stubState, stubBackendNotification);
  expect(stubState.backendNotifications).toHaveLength(0);
});

test('removeNotification commits REMOVE_NOTIFICATION', () => {
  const actionContext = {
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: {
      allNotifications: [stubFullNotification],
    },
    rootState: {
      loadingState: false,
      initialLoadDone: true,
    },
    rootGetters: {},
    state: {
      notifications: [],
      backendNotifications: [],
    },
  };
  const token = stubFullNotification.token;
  actions.removeNotification(actionContext, token);
  expect(actionContext.commit).toHaveBeenCalledWith('REMOVE_NOTIFICATION', stubFullNotification);
  expect(actionContext.commit).toHaveBeenCalledTimes(1);
});

test('removeNotification commits REMOVE_BACKEND_NOTIFICATION', () => {
  const stubNotification = mapBackendNotification(stubBackendNotification);
  const actionContext = {
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: {
      allNotifications: [stubNotification],
    },
    rootState: {
      loadingState: false,
      initialLoadDone: true,
    },
    rootGetters: {},
    state: {
      notifications: [],
      backendNotifications: [stubBackendNotification],
    },
  };
  const token = stubNotification.token;
  actions.removeNotification(actionContext, token);
  expect(actionContext.commit).toHaveBeenCalledWith(
    'REMOVE_BACKEND_NOTIFICATION', stubBackendNotification,
  );
  expect(actionContext.commit).toHaveBeenCalledTimes(1);
});

test('removeAllNotifications removes local and backend notifications', async () => {
  const stubStore = new vuex.Store<any>({
    modules: {
      notifications: {
        ...notifications,
        state: {
          notifications: [stubFullNotification],
          backendNotifications: [stubBackendNotification],
        },
      },
    },
  });
  await stubStore.dispatch('notifications/removeAllNotifications');
  expect(stubStore.state.notifications.notifications).toHaveLength(0);
  expect(stubStore.state.notifications.backendNotifications).toHaveLength(0);
});

test.todo('check the expected behavior of onClick');
