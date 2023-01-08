import { mount } from '@vue/test-utils';
import Vuex from 'vuex';

import Notification from '@/components/notifications/Notification.vue';
import { stubFullNotification } from './stubs';

test('Notification renders the notification model', () => {
  const store = new Vuex.Store({
    modules: {
      activity: {
        namespaced: true,
        getters: {
          level: () => 'stub-activity-level',
        },
      },
    },
  });

  const notification = mount(Notification, {
    global: {
      plugins: [store],
    },
    props: stubFullNotification,
  });

  expect(notification.html()).toContain(stubFullNotification.token);
});
