import * as uuid from 'uuid';

import { defaultHideAfter, mapBackendNotification, severityMapping } from '@/store/modules/notifications';
import { stubBackendNotification, stubUuid } from './stubs';

jest.mock('uuid');

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
  uuid.v4.mockReturnValue(stubUuid);
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.token).toBe(stubUuid);
});

test('backend notifications are flagged with isBackendNotification', () => {
  const result = mapBackendNotification(stubBackendNotification);
  expect(result.isBackendNotification).toBe(true);
});

test.todo('check the expected behavior of onClick');
