import { Configuration, ClientApi } from './notifications';

const notificationsApi = new ClientApi(new Configuration({
  basePath: process.env.VUE_APP_NOTIFICATION_API_URL,
}));

export default { notificationsApi };
