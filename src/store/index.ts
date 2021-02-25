// mocks
import MenuData from '@/assets/mocks/menu.json';
import NotificationData from '@/assets/mocks/notifications.json';
// vue
import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import axios from 'axios';
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
import meta from './modules/meta';

export const key: InjectionKey<Store<State>> = Symbol('some description');

// get env vars
const portalUrl = process.env.VUE_APP_PORTAL_URL || '';
const portalJson = process.env.VUE_APP_PORTAL_DATA || './portal.json';
const portalMeta = process.env.VUE_APP_META_DATA || './meta.json';

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
    meta,
  },
  state: {},
  mutations: {},
  actions: {
    loadPortal: ({ commit }) => {
      store.dispatch('modal/setShowLoadingModal');

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
        // store portal data
        console.log('Loading Portal');

        // get meta data
        axios.get(`${portalUrl}${portalMeta}`).then(
          (response) => {
            const metaData = response.data;
            console.log('metaData - index: ', metaData);
            store.dispatch('meta/setMeta', metaData);
            resolve();
          }, (error) => {
            console.error(error);
            resolve();
          },
        );

        // get portal data
        axios.get(`${portalUrl}${portalJson}`).then(
          (response) => {
            const PortalData = response.data;
            store.dispatch('portalData/setPortal', PortalData);
            store.dispatch('categories/storeOriginalArray', PortalData);
            store.dispatch('categories/setStandard');
            store.dispatch('user/setLogin', {
              user: {
                username: PortalData.user,
                mayEditPortal: PortalData.may_edit_portal,
              },
            });
            store.dispatch('modal/setHideModal');
            resolve();
            setTimeout(() => {
              // Hide notification bubble
              store.dispatch('notificationBubble/setHideBubble');
            }, 4000);
          }, (error) => {
            store.dispatch('modal/setHideModal');
            resolve();
          },
        );
      });
    },
  },
  getters: {},
});

// Define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
