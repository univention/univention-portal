import PortalData from '@/assets/mocks/portal.json';
import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
// Modules
import categories from './modules/categories';
import locale from './modules/locale';
import modal from './modules/modal';
import navigation from './modules/navigation';
import notificationBubble from './modules/notificationBubble';
import portalData from './modules/portalData';
import user from './modules/user';

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
  },
  state: {},
  mutations: {},
  actions: {
    loadPortal: ({ commit }) => {
      store.dispatch('modal/setShowLoadingModal');

      // Store portal data
      store.dispatch('portalData/setPortal', PortalData);

      // TODO: Once notification API is available: set state only if notifications are present
      store.dispatch('notificationBubble/setShowBubble');
      store.dispatch('notificationBubble/setShowBubbleEmbedded');

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          store.dispatch('categories/setDevStandard');
          store.dispatch('modal/setHideModal');
          resolve();
        }, 1000);
        setTimeout(() => {
          // Hide notification bubble
          store.dispatch('notificationBubble/setHideBubble');
          resolve();
        }, 4000);
      });
    },
  },
  getters: {},
});

// Define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
