import PortalCategory from '@/components/PortalCategory.vue';
import PortalFolder from '@/components/PortalFolder.vue';
import PortalTile from '@/components/PortalTile.vue';
import { Module } from 'vuex';

const dummyDescription = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.';

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
                new PortalTile({
                  title: 'Jitsi',
                  link: 'https://www.jitsi.com',
                  description: `Jitsi: ${dummyDescription}`,
                }),
                new PortalTile({
                  title: 'Ubuntu',
                  link: 'https://www.ubuntu.com',
                  description: `Ubuntu: ${dummyDescription}`,
                }),
                new PortalTile({
                  title: 'Relution',
                  link: 'https://www.relution.com',
                  description: `Relution: ${dummyDescription}`,
                }),
                new PortalTile({
                  title: 'Rocketchat',
                  link: 'https://www.rocketchat.com',
                  description: `Rocketchat: ${dummyDescription}`,
                }),
                new PortalTile({
                  title: 'Open Xchange',
                  link: 'https://www.ox.com',
                  description: `Open Xchange: ${dummyDescription}`,
                }),
                new PortalTile({
                  title: 'UCS@school',
                  link: 'https://www.univention.com',
                  description: `UCS@school: ${dummyDescription}`,
                }),
              ],
            }),
          ],
        }),
      ];
      state.categories = folderCategories;
    },
    DEV_STANDARD(state) {
      const standardCategories = [
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
      state.categories = standardCategories;
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

export default categories;
