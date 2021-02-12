import { Module } from 'vuex';

export interface State {
  user: object;
}

const user: Module<State, any> = {
  namespaced: true,
  state: {
    user: {},
  },

  mutations: {
    devLogin: (state) => {
      state.user = {
        username: 'Administrator',
        isAdmin: true,
        loggedIn: true,
      };
    },
    devLogout: (state) => {
      state.user = {};
    },
  },

  getters: {
    userState: (state) => state.user,
  },

  actions: {
    setLogin({ commit }, payload) {
      commit('devLogin', payload);
    },
    setLogout({ commit }, payload) {
      commit('devLogout', payload);
    },
  },
};

export default user;
