import { Module } from 'vuex';

interface User {
  username: string;
  mayEditPortal: boolean;
}

export interface State {
  user: User;
}

const user: Module<State, any> = {
  namespaced: true,
  state: {
    user: {
      username: '',
      mayEditPortal: false,
    },
  },

  mutations: {
    devLogin: (state) => {
      state.user = {
        username: 'Administrator',
        mayEditPortal: true,
      };
    },
    login: (state, payload) => {
      state.user = payload.user;
    },
    logout: (state) => {
      state.user = {
        username: '',
        mayEditPortal: false,
      };
    },
  },

  getters: {
    userState: (state) => state.user,
  },

  actions: {
    setDevLogin({ commit }, payload) {
      commit('devLogin', payload);
    },
    setLogin({ commit }, payload) {
      commit('login', payload);
    },
    setLogout({ commit }, payload) {
      commit('logout', payload);
    },
  },
};

export default user;
