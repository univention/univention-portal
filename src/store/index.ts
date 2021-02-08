import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import PortalCategory from '@/components/PortalCategory.vue';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

export interface State {
  categories: Array<PortalCategory>;
  user: object;
  loading: boolean;
  modalVisible: boolean;
  modalComponent: any;
}

export const key: InjectionKey<Store<State>> = Symbol('some description');

const dummyDescription = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.';

export const store = createStore<State>({
  state: {
    categories: [],
    loading: false,
    modalVisible: false,
    modalComponent: null,
    user: {},
  },
  mutations: {
    startLoading: (state) => {
      state.loading = true;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    devStandard: (state) => {
      const categories = [
        new PortalCategory({
          title: 'Applications',
          tiles: [
            new PortalTile({
              title: 'ownCloud',
              link: 'https://www.owncloud.com',
              description: `Applications: ${dummyDescription}`,
            }),
            new PortalTile({
              title: 'Nextcloud',
              link: 'https://www.nextcloud.com',
              description: `Nextcloud: ${dummyDescription}`,
            }),
          ],
        }),
        new PortalCategory({
          title: 'Administration',
          tiles: [
            new PortalTile({
              title: 'UMC',
              link: '/umc/',
              description: `UMC: ${dummyDescription}`,
            }),
            new PortalTile({
              title: 'Blog',
              link: 'https://www.univention.de/blog',
              description: `Blog: ${dummyDescription}`,
            }),
          ],
        }),
      ];
      state.categories = categories;
    },
    devFolder: (state) => {
      const categories = [
        new PortalCategory({
          title: 'Applications',
          tiles: [
            new PortalTile({
              title: 'ownCloud',
              link: 'https://www.owncloud.com',
              description: `ownCloud: ${dummyDescription}`,
            }),
            new PortalFolder({
              title: 'Favorites',
              tiles: [
                new PortalTile({
                  title: 'Nextcloud',
                  link: 'https://www.nextcloud.com',
                  description: `Nextcloud: ${dummyDescription}`,
                }),
              ],
            }),
          ],
        }),
      ];
      state.categories = categories;
    },
    devEmpty: (state) => {
      state.categories = [];
    },
    devLogin: (state) => {
      state.user = {
        username: 'Administrator',
        isAdmin: true,
      };
    },
    devLogout: (state) => {
      state.user = {};
    },
    replace: (state, payload) => {
      state.categories = payload.categories;
    },
    showModal: (state, componentName) => {
      state.modalVisible = true;
      state.modalComponent = componentName;
    },
    hideModal: (state) => {
      state.modalVisible = false;
    },
  },
  actions: {
    loadPortal: ({ commit }) => {
      commit('startLoading');
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('devStandard');
          commit('stopLoading');
          resolve();
        }, 100);
      });
    },
  },
  modules: {},
  getters: {
    modalState: (state) => state.modalVisible,
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
