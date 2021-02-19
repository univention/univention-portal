import { Module } from 'vuex';

export interface Tab {
  tabToken: string,
  tabIcon: string,
  tabLabel: string,
  ariaLabel: string,
  tabStatic: boolean,
  tabImage: {
    filePath: string,
    fileName: string,
    fileType: string,
    altText: string,
    imageClass: string
  },
  iframeLink: string
}

export interface State {
  tabs: Array<Tab>;
}

const tabs: Module<State, any> = {
  namespaced: true,
  state: {
    tabs: [],
  },

  mutations: {
    ALL_TABS(state, payload) {
      state.tabs = payload;
    },
    ADD_TAB(state, tab) {
      state.tabs.push(tab);
    },
    DELETE_TAB(state, token) {
      const index = state.tabs.findIndex((tab) => tab.tabToken === token);
      state.tabs.splice(index, 1);
    },
  },

  getters: {
    getAllTabs: (state) => state.tabs,
  },

  actions: {
    setAllTabs({ commit }, payload) {
      commit('ALL_TABS', payload);
    },
    addTab({ commit }, tab: Tab) {
      commit('ADD_TAB', tab);
    },
    deleteTab({ commit }, token) {
      commit('DELETE_TAB', token);
    },
  },
};

export default tabs;
