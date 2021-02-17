import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

import PortalData from '@/assets/mocks/portal.json';
import TabsData from '@/assets/mocks/tabs.json';

// modules
import categories from './modules/categories';
import navigation from './modules/navigation';
import notificationBubble from './modules/notificationBubble';
import modal from './modules/modal';
import user from './modules/user';
import locale from './modules/locale';
import portalData from './modules/portalData';
import tabs from './modules/tabs';

export const key: InjectionKey<Store<State>> = Symbol('some description');

export interface State {}

export const store = createStore<State>({
  modules: {
    categories,
    modal,
    navigation,
    notificationBubble,
    user,
    locale,
    portalData,
    tabs,
  },
  state: {},
  mutations: {},
  actions: {
    loadPortal: ({ commit }) => {
      store.dispatch('modal/setShowLoadingModal');

      // store portal data
      store.dispatch('portalData/setPortal', PortalData);

      // store tabs
      store.dispatch('tabs/setAllTabs', TabsData);

      // TODO: Once notification API is available: set state only if notifications are present
      store.dispatch('notificationBubble/setShowBubble');
      store.dispatch('notificationBubble/setShowBubbleEmbedded');

      return new Promise((resolve) => {
        setTimeout(() => {
          store.dispatch('categories/setDevStandard');
          store.dispatch('modal/setHideModal');
          resolve();
        }, 1000);
        setTimeout(() => {
          // hide notification bubble
          store.dispatch('notificationBubble/setHideBubble');
          resolve();
        }, 4000);
      });
    },
  },
  getters: {},
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
