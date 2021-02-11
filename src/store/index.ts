import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

// modules
import categories from './modules/categories';
import loading from './modules/loading';
import navigation from './modules/navigation';
import modal from './modules/modal';
import user from './modules/user';

export const key: InjectionKey<Store<State>> = Symbol('some description');

export interface State {}

export const store = createStore<State>({
  modules: {
    categories,
    modal,
    navigation,
    user,
  },
  state: {},
  mutations: {},
  actions: {
    loadPortal: ({ commit }) => {
      store.dispatch('modal/setShowLoadingModal');
      return new Promise((resolve) => {
        setTimeout(() => {
          store.dispatch('categories/setDevStandard');
          store.dispatch('modal/setHideModal');
          resolve();
        }, 1000);
      });
    },
  },
  getters: {},
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
