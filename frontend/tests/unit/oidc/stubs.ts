import vuex from 'vuex';

import notifications from '@/store/modules/notifications';
import oidc from '@/store/modules/oidc';

export const createStubStore = () => new vuex.Store<any>({
  modules: {
    notifications,
    oidc,
  },
});

export default createStubStore;
