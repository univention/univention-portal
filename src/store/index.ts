import { createStore } from "vuex";
import Category from "@/components/Category.vue";
import Tile from "@/components/Tile.vue";

export default createStore({
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
    }
    devEmpty: state => {
      state.categories = [];
    }
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
