import {
  defaultHideAfter, mapBackendNotification, mutations, severityMapping,
} from '@/store/modules/notifications';
import { stubBackendNotification, stubFullNotification } from './stubs';

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

// TODO: Needs working auto-hiding first
test.skip('visible is set correctly', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.visible).toBe(true);
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

test('REMOVE_NOTIFICATION removes local notification', () => {
  const stubState = {
    notifications: [stubFullNotification],
    backendNotifications: [],
  };
  mutations.REMOVE_NOTIFICATION(stubState, stubFullNotification);
  expect(stubState.notifications).toHaveLength(0);
});

test('REMOVE_BACKEND_NOTIFICATION removes backend notification', () => {
  const stubState = {
    notifications: [],
    backendNotifications: [stubBackendNotification],
  };
  mutations.REMOVE_BACKEND_NOTIFICATION(stubState, stubBackendNotification);
  expect(stubState.backendNotifications).toHaveLength(0);
});

test.todo('check the expected behavior of onClick');
