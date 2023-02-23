import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import * as apiclient from '@/store/modules/notifications/apiclient';

jest.mock('event-source-polyfill');

const EventSource = NativeEventSource || EventSourcePolyfill;

afterEach(() => {
  jest.resetAllMocks();
});

describe('connectEventSource', () => {

  test('connects to the stream api endpoint', () => {
    const streamUrl = `${apiclient.notificationsApiUrl}/v1/notifications/stream`;
    apiclient.connectEventSource();
    expect(EventSource).toHaveBeenCalledWith(streamUrl, { headers: {} });
  });

  test('connects to the stream api endpoint with token', () => {
    const streamUrl = `${apiclient.notificationsApiUrl}/v1/notifications/stream`;
    const authToken = 'foo';
    apiclient.connectEventSource(authToken);
    expect(EventSource).toHaveBeenCalledWith(streamUrl, { headers: { Authorization: `Bearer ${authToken}` } });
  });

});
