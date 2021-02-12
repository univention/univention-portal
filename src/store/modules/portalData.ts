import { Module } from 'vuex';

export interface State {
  portal: Object;
}

const portal: Module<State, any> = {
  namespaced: true,
  state: {
    portal: {},
  },

  mutations: {
    PORTALDATA(state, payload) {
      state.portal = payload;
    },
  },

  getters: {
    getPortal: (state) => state.portal,
  },

  actions: {
    setPortal({ commit }, payload) {
      commit('PORTALDATA', payload);
    },
  },
};

export default portal;
