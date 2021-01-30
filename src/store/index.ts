import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import Category from "@/components/Category.vue";
import Tile from "@/components/Tile.vue";

export interface State {
  categories: Array<Category>;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    categories: []
  },
  mutations: {
    devStandard: state => {
      const categories = [
        new Category({
          title: "Applications",
          tiles: [
            new Tile({
              title: "ownCloud",
              link: "https://www.owncloud.com"
            }),
            new Tile({
              title: "Nextcloud",
              link: "https://www.nextcloud.com"
            })
          ]
        }),
        new Category({
          title: "Administration",
          tiles: [
            new Tile({
              title: "UMC",
              link: "/umc/"
            }),
            new Tile({
              title: "Blog",
              link: "https://www.univention.de/blog"
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
      return new Promise(resolve => {
        setTimeout(() => {
          commit("devStandard");
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
