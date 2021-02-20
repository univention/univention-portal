// mocks
import MenuData from '@/assets/mocks/menu.json';
import NotificationData from '@/assets/mocks/notifications.json';
import PortalData from '@/assets/mocks/portal.json';
// vue
import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
// modules
import categories from './modules/categories';
import locale from './modules/locale';
import menu from './modules/menu';
import modal from './modules/modal';
import navigation from './modules/navigation';
import notificationBubble from './modules/notificationBubble';
import portalData from './modules/portalData';
import tabs from './modules/tabs';
import user from './modules/user';

export const key: InjectionKey<Store<State>> = Symbol('some description');

export interface State {}

export const store = createStore<State>({
  modules: {
    categories,
    locale,
    modal,
    navigation,
    notificationBubble,
    portalData,
    user,
    menu,
    tabs,
  },
  state: {},
  mutations: {},
  actions: {
    loadPortal: ({ commit }) => {
      store.dispatch('modal/setShowLoadingModal');

      // store portal data
      store.dispatch('portalData/setPortal', PortalData);

      // store notification data
      // TODO: Only add data to notifications store if data is available
      store.dispatch('notificationBubble/setContent', NotificationData);

      // store menu data
      store.dispatch('menu/setMenu', MenuData);
      store.dispatch('menu/setMenuLinks', MenuData.menu_links);
      store.dispatch('menu/setUserLinks', MenuData.user_links);

      // display standalone notification bubbles
      if (store.getters['notificationBubble/bubbleContent'].length > 0) {
        store.dispatch('notificationBubble/setShowBubble');
      }

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          store.dispatch('categories/storeOriginalArray', PortalData);
          store.dispatch('categories/setStandard');
          store.dispatch('modal/setHideModal');
          resolve();
        }, 1000);
        setTimeout(() => {
          // Hide notification bubble
          // store.dispatch('notificationBubble/setHideBubble');
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
