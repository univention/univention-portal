import { Dispatch } from 'vuex';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';

import { ClientApi, Configuration } from '@/apis/notifications';

const EventSource = NativeEventSource || EventSourcePolyfill;

export const notificationsApiUrl = process.env.VUE_APP_NOTIFICATIONS_API_URL || './notifications-api';

export const getNotificationsApi = (token?: string): ClientApi => new ClientApi(
  new Configuration({
    accessToken: token,
    basePath: notificationsApiUrl,
  }),
);

export const connectEventSource = async (token?: string): Promise<EventSource> => {
  const streamUrl = `${notificationsApiUrl}/v1/notifications/stream`;

  // send OIDC token if we have it
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const eventSource = new EventSource(streamUrl, { headers });
  return eventSource;
};

export const connectEventListener = (eventSource: EventSource, eventName: string, actionName: string, dispatch: Dispatch): void => {
  eventSource.addEventListener(eventName, (event) => {
    // system events (`open`/`error`) provide no data,
    // while message events come with payload
    const eventData =
      (['open', 'error'].includes(eventName))
        ? undefined
        : JSON.parse((event as MessageEvent).data);
    dispatch(actionName, eventData);
  });
};

export default getNotificationsApi;
