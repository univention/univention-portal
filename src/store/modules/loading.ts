import { Module } from 'vuex';

export interface State {
  loading: boolean;
}

const loading: Module<State, any> = {
  namespaced: true,
  state: {
    loading: false,
  },

  mutations: {
    STARTLOADING(state) {
      state.loading = true;
    },
    STOPLOADING(state) {
      state.loading = false;
    },
  },

  getters: {
    loadingState: (state) => state.loading,
  },

  actions: {
    setStartLoading({ commit }, loadingStart) {
      commit('STARTLOADING', loadingStart);
    },
    setStopLoading({ commit }, loadingStop) {
      commit('STOPLOADING', loadingStop);
    },
  },
};

export default loading;
