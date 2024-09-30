import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import UmcSessionRefreshIframe from '@/components/globals/UmcSessionRefreshIframe.vue';
import umcSession, { UmcSessionState } from '@/store/modules/umcSession';

function createStubStore(initialState?: UmcSessionState) {
  const store = createStore<any>({
    modules: {
      umcSession: {
        ...umcSession,
        state: {
          ...umcSession.state,
          ...initialState,
        },
      },
    },
  });
  return store;
}

test('Renders iframe to refresh the session when refresh is needed', async () => {
  const store = createStubStore({ refreshNeeded: true });
  const wrapper = mount(UmcSessionRefreshIframe, {
    global: {
      plugins: [
        store,
      ],
    },
  });

  expect(wrapper.find('iframe').exists()).toBe(true);
});

test('Renders nothing when refresh is not needed', async () => {
  const store = createStubStore({ refreshNeeded: false });
  const wrapper = mount(UmcSessionRefreshIframe, {
    global: {
      plugins: [
        store,
      ],
    },
  });

  expect(wrapper.find('iframe').exists()).toBe(false);
});
