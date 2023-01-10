import * as apiclient from '@/store/modules/notifications/apiclient';

beforeAll(() => {
  (globalThis as any).EventSource = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('connectEventSource', () => {

  test('connects to the stream api endpoint', () => {
    const streamUrl = `${apiclient.notificationsApiUrl}/v1/notifications/stream`;
    const eventSource = apiclient.connectEventSource();
    expect(EventSource).toHaveBeenCalledWith(streamUrl);
  });

});
