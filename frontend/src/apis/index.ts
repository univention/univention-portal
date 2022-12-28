import {
  Configuration,
  DefaultApi,
} from './notifications';

export const notificationApi = new DefaultApi(new Configuration({
  basePath: process.env.VUE_APP_NOTIFICATION_API_URL,
}));

export default {};
