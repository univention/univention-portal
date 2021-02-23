import { Module } from 'vuex';

export interface Portal {
  name: Object;
}

export interface PortalData {
  portal: Portal;
}

export interface State {
  portal: PortalData;
}

const portal: Module<State, any> = {
  namespaced: true,
  state: {
    portal: {
      portal: {
        name: {
          en_US: 'Univention Portal',
        },
      },
    },
  },

  mutations: {
    PORTALDATA(state, payload) {
      state.portal = payload;
    },
  },

  getters: {
    getPortal: (state) => state.portal,
    portalName: (state) => state.portal.portal.name,
  },

  actions: {
    setPortal({ commit }, payload) {
      commit('PORTALDATA', payload);
    },
  },
};

export default portal;
