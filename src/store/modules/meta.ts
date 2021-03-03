import { Module } from 'vuex';
import axios from 'axios';

export interface State {
  meta: Object;
}

const meta: Module<State, any> = {
  namespaced: true,
  state: {
    meta: {},
  },

  mutations: {
    META(state, payload) {
      state.meta = payload;
    },
  },

  getters: {
    getMeta: (state) => state.meta,
  },

  actions: {
    setMeta({ commit }, payload) {
      commit('META', payload);
    },
  },
};

export default meta;
