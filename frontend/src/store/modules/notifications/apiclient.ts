import { Dispatch } from 'vuex';

import { ClientApi, Configuration } from '@/apis/notifications';

export const notificationsApiUrl = process.env.VUE_APP_NOTIFICATIONS_API_URL || './notifications-api';
const notificationsApi = new ClientApi(new Configuration({
  basePath: notificationsApiUrl,
}));

export const connectEventSource = (): EventSource => {
  const streamUrl = `${notificationsApiUrl}/v1/notifications/stream`;
  const eventSource = new EventSource(streamUrl);
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

export default notificationsApi;
