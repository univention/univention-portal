import { Module } from 'vuex';

export interface State {
  tabs: Object;
}

const tabs: Module<State, any> = {
  namespaced: true,
  state: {
    tabs: {},
  },

  mutations: {
    ALL_TABS(state, payload) {
      state.tabs = payload;
    },
  },

  getters: {
    getAllTabs: (state) => state.tabs,
  },

  actions: {
    setAllTabs({ commit }, payload) {
      commit('ALL_TABS', payload);
    },
  },
};

export default tabs;
