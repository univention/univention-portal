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
  activeTab: Tab | null;
  tabs: Array<Tab>;
}

const tabs: Module<State, any> = {
  namespaced: true,
  state: {
    activeTab: null,
    tabs: [],
  },

  mutations: {
    ALL_TABS(state, payload: Array<Tab>) {
      state.tabs = payload;
    },
    ACTIVE_TAB(state, tab: Tab) { // index instead of tab??
      state.activeTab = tab;
    },
    ADD_TAB(state, tab: Tab) {
      state.tabs.push(tab);
      state.activeTab = tab;
    },
    DELETE_TAB(state, token: string) { // index instead of tab??
      const index = state.tabs.findIndex((tab) => tab.tabToken === token);
      state.tabs.splice(index, 1);
    },
  },

  getters: {
    getAllTabs: (state) => state.tabs,
    getActiveTab: (state) => state.activeTab,
  },

  actions: {
    setAllTabs({ commit }, payload: Array<Tab>) {
      commit('ALL_TABS', payload);
    },
    setActiveTab({ commit }, tab: Tab) {
      commit('ACTIVE_TAB', tab);
    },
    addTab({ commit }, tab: Tab) {
      commit('ADD_TAB', tab);
    },
    deleteTab({ commit }, token: string) {
      commit('DELETE_TAB', token);
    },
  },
};

export default tabs;
