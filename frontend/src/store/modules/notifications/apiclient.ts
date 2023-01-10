import { ClientApi, Configuration } from '@/apis/notifications';

export const notificationsApiUrl = process.env.VUE_APP_NOTIFICATIONS_API_URL || './notifications-api';
const notificationsApi = new ClientApi(new Configuration({
  basePath: notificationsApiUrl,
}));

export const connectEventSource = function (): EventSource {
  const streamUrl = `${notificationsApiUrl}/v1/notifications/stream`;
  const eventSource = new EventSource(streamUrl);
  return eventSource;
};

export default notificationsApi;
