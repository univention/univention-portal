import { Module } from 'vuex';

import createMenuStructure from '@/jsHelper/createMenuStructure.js';

export interface State {
  menu: Object;
  menuLinks: Array<any>,
  userLinks: Array<any>,
}

const menu: Module<State, any> = {
  namespaced: true,
  state: {
    menu: {},
    menuLinks: [],
    userLinks: [],
  },

  mutations: {
    MENU(state, payload) {
      const menuStructure = createMenuStructure(payload);
      console.log('menuStructure', menuStructure);
      state.menu = menuStructure;
    },
    MENU_LINKS(state, payload) {
      state.menuLinks = payload;
    },
    USER_LINKS(state, payload) {
      state.userLinks = payload;
    },
  },

  getters: {
    getMenu: (state) => state.menu,
    getMenuLinks: (state) => state.menuLinks,
    getUserLinks: (state) => state.userLinks,
  },

  actions: {
    setMenu({ commit }, payload) {
      commit('MENU', payload);
    },
    setMenuLinks({ commit }, payload) {
      commit('MENU_LINKS', payload);
    },
    setUserLinks({ commit }, payload) {
      commit('USER_LINKS', payload);
    },
  },
};

export default menu;
