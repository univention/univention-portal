import { defaultHideAfter, mapBackendNotification, severityMapping } from '@/store/modules/notifications';
import { Notification as BackendNotification, NotificationSeverity } from '@/apis/notifications';

const backendNotification: BackendNotification = {
  id: 'cd7e52fb-922c-4255-b727-c8d42c1b1f32',
  sourceUid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  targetUid: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  title: 'Example notification',
  details: 'string',
  notificationType: 'event',
  severity: 'info',
  receiveTime: '2023-01-07T09:47:07.789861',

  // optional attributes
  sticky: undefined,
  needsConfirmation: undefined,
  data: undefined,
  readTime: undefined,
  sseSendTime: undefined,
  confirmationTime: undefined,
  expireTime: undefined,
};

test('title is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.title).toBe(backendNotification.title);
});

test('description is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.description).toBe(backendNotification.details);
});

test('hidingAfter is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.hidingAfter).toBe(defaultHideAfter);
});

test.each(
  Object.entries(severityMapping),
)('importance is set correctly from severity(%s -> %s)', (severity: any, expected) => {
  const notification = {
    ...backendNotification,
    severity,
  };
  const result = mapBackendNotification(notification);
  expect(result.importance).toBe(expected);
});

// TODO: Needs working auto-hiding first
test.skip('visible is set correctly', () => {
  const result = mapBackendNotification(backendNotification);
  expect(result.visible).toBe(true);
});

test('token is set correctly', () => {
  jest.spyOn(Math, 'random').mockImplementation(() => 42);
  const result = mapBackendNotification(backendNotification);
  expect(result.token).toBe(42);
  jest.restoreAllMocks();
});

test.todo('check the expected behavior of onClick');