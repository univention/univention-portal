import { Module } from 'vuex';

export interface State {
  locale: string;
}

const locale: Module<State, any> = {
  namespaced: true,
  state: {
    locale: 'en_US',
  },

  mutations: {
    NEWLOCALE(state, payload) {
      state.locale = payload.locale;
    },
  },

  getters: {
    getLocale: (state) => state.locale,
  },

  actions: {
    setLocale({ commit }, payload) {
      commit('NEWLOCALE', payload);
    },
  },
};

export default locale;
