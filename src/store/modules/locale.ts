import { Module } from 'vuex';

// get env vars
const portalLocale = process.env.VUE_APP_LOCALE || 'en_US';
export interface State {
  locale: string;
}

const locale: Module<State, any> = {
  namespaced: true,
  state: {
    locale: portalLocale,
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
