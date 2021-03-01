import PortalCategory from '@/components/PortalCategory.vue';
import PortalFolder from '@/components/PortalFolder.vue';
import PortalTile from '@/components/PortalTile.vue';
import { Module } from 'vuex';

import createCategories from '@/jsHelper/createCategories.js';

export interface State {
  categories: Array<PortalCategory>;
}

const categories: Module<State, any> = {
  namespaced: true,
  state: {
    categories: [],
  },

  mutations: {
    DEV_EMPTY(state) {
      state.categories = [];
    },
    DEV_FOLDER(state) {
      const folderCategories = [
        new PortalCategory({
          title: {
            de_DE: 'Applications',
            en_US: 'Applications',
          },
          tiles: [
            new PortalTile({
              title: {
                de_DE: 'OwnCloud',
                en_US: 'OwnCloud',
              },
              links: [
                'https://www.owncloud.com',
              ],
              description: {
                de_DE: 'OwnCloud Online DatenSpeicher',
                en_US: 'OwnCloud Online Data Storage',
              },
            }),
            new PortalFolder({
              title: {
                de_DE: 'Favoriten',
                en_US: 'Favorites',
              },
              tiles: [
                new PortalTile({
                  title: {
                    de_DE: 'Nextcloud',
                    en_US: 'Nextcloud',
                  },
                  links: [
                    'https://www.nextcloud.com',
                  ],
                  description: {
                    de_DE: 'Datenspeicher online für verschiedene Zwecke.',
                    en_US: 'Online Storage cloud base',
                  },
                }),
                new PortalTile({
                  title: {
                    de_DE: 'Jitsi',
                    en_US: 'Jitsi',
                  },
                  links: [
                    'https://www.jitsi.com',
                  ],
                  description: {
                    de_DE: 'Online Videkonferenzentool',
                    en_US: 'Online Meeting Tool',
                  },
                }),
                new PortalTile({
                  title: {
                    de_DE: 'Ubuntu',
                    en_US: 'Ubuntu',
                  },
                  links: [
                    'https://www.ubuntu.com',
                  ],
                  description: {
                    de_DE: 'Ubuntu Lorem ipsum deutsch',
                    en_US: 'Ubuntu Lorem ipsum englisch',
                  },
                }),
              ],
            }),
          ],
        }),
      ];
      state.categories = folderCategories;
    },
    STANDARD(state) {
      // state.categories = state.originalArray;
    },
    REPLACE(state, payload) {
      state.categories = payload.categories;
    },
    SAVE_ORIGINAL_ARRAY_ONCE(state, payload) {
      const categoriesFromJSON = createCategories(payload);
      state.categories = categoriesFromJSON;
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
    setStandard({ commit }) {
      commit('STANDARD');
    },
    setReplace({ commit }, payload) {
      commit('REPLACE', payload);
    },
    setFromMock({ commit }, payload) {
      commit('STANDARD', payload);
    },
    storeOriginalArray({ commit }, payload) {
      commit('SAVE_ORIGINAL_ARRAY_ONCE', payload);
    },
  },
};

export default categories;
