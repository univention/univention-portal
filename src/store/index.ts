import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import Category from "@/components/Category.vue";
import Tile from "@/components/Tile.vue";
import Folder from "@/components/Folder.vue";

export interface State {
  categories: Array<Category>;
  loading: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

const dummyDescription = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.";

export const store = createStore<State>({
  state: {
    categories: [],
    loading: false
  },
  mutations: {
    startLoading: state => {
      state.loading = true;
    },
    stopLoading: state => {
      state.loading = false;
    },
    devStandard: state => {
      const categories = [
        new Category({
          title: "Applications",
          tiles: [
            new Tile({
              title: "ownCloud",
              link: "https://www.owncloud.com",
              description: `Applications: ${dummyDescription}`,
            }),
            new Tile({
              title: "Nextcloud",
              link: "https://www.nextcloud.com",
              description: `Nextcloud: ${dummyDescription}`,
            })
          ]
        }),
        new Category({
          title: "Administration",
          tiles: [
            new Tile({
              title: "UMC",
              link: "/umc/",
              description: `UMC: ${dummyDescription}`,
            }),
            new Tile({
              title: "Blog",
              link: "https://www.univention.de/blog",
              description: `Blog: ${dummyDescription}`,
            })
          ]
        })
      ];
      state.categories = categories;
    },
    devFolder: state => {
      const categories = [
        new Category({
          title: "Applications",
          tiles: [
            new Tile({
              title: "ownCloud",
              link: "https://www.owncloud.com",
              description: `ownCloud: ${dummyDescription}`,
            }),
            new Folder({
              title: "Favorites",
              tiles: [
                new Tile({
                  title: "Nextcloud",
                  link: "https://www.nextcloud.com",
                  description: `Nextcloud: ${dummyDescription}`,
                })
              ]
            })
          ]
        })
      ];
      state.categories = categories;
    },
    devEmpty: state => {
      state.categories = [];
    },
    replace: (state, payload) => {
      state.categories = payload.categories;
    }
  },
  actions: {
    loadPortal: ({ commit }) => {
      commit("startLoading");
      return new Promise(resolve => {
        setTimeout(() => {
          commit("devStandard");
          commit("stopLoading");
          resolve();
        }, 100);
      });
    }
  },
  modules: {}
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
