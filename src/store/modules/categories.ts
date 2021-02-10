import { Module } from 'vuex';

import PortalCategory from '@/components/PortalCategory.vue';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

const dummyDescription = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.';

export interface State {
  categories: Array<PortalCategory>;
}

const catagories: Module<State, any> = {
  namespaced: true,
  state: {
    categories: [],
  },

  mutations: {
    DEV_EMPTY(state) {
      state.categories = [];
    },
    DEV_FOLDER(state) {
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
    DEV_STANDARD(state) {
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
    REPLACE(state, payload) {
      state.categories = payload.categories;
    },
  },

  getters: {
    categoryState: (state) => state.categories,
  },

  actions: {
    setDevEmpty({ commit }, payload) {
      commit('DEV_EMPTY', payload);
    },
    setDevFolder({ commit }, payload) {
      commit('DEV_FOLDER', payload);
    },
    setDevStandard({ commit }, payload) {
      commit('DEV_STANDARD', payload);
    },
    setReplace({ commit }, payload) {
      commit('REPLACE', payload);
    },
  },
};

export default catagories;
