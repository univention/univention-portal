import { mapBackendNotification } from '@/store/modules/notifications';
import { Notification as BackendNotification } from '@/apis/notifications';

const backendNotification: BackendNotification = {
  id: "cd7e52fb-922c-4255-b727-c8d42c1b1f32",
  sourceUid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  targetUid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  title: "Example notification",
  details: "string",
  notificationType: "event",
  severity: "info",
  receiveTime: "2023-01-07T09:47:07.789861",
};

test('title is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.title).toBe(backendNotification.title);
});

test('description is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.description).toBe(backendNotification.details);
});

test.skip('hidingAfter is set correctly', () => {
  // TODO: Find out the correct expected mapping
  const result = mapBackendNotification(backendNotification);
  expect(result.hidingAfter).toBe(-1);
});

test.skip('importance is set correctly', () => {
  // TODO: Find out the correct mapping and fix this test and the
  // implementation.
  const result = mapBackendNotification(backendNotification);
  expect(result.importance).toBe('unclear');
});

test.skip('visible is set correctly', () => {
  // TODO: Find out the correct mapping and fix this test and the
  // implementation.
  const result = mapBackendNotification(backendNotification);
  expect(result.visible).toBe(null);
});

test.skip('token is set correctly', () => {
  // TODO: Find out the correct mapping and fix this test and the
  // implementation.
  const result = mapBackendNotification(backendNotification);
  expect(result.token).toBe(null);
});

test.todo('check the expected behavior of onClick');
