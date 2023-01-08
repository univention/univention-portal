import * as models from '@/store/modules/notifications/notifications.models';
import { stubFullNotification, stubUuid } from './stubs';

test('token is a uuid string', () => {
  const myNotification: models.FullNotification = {
    ...stubFullNotification,
    token: stubUuid,
  };
  expect(myNotification.token).toBe(stubUuid);
});
