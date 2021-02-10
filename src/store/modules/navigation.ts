import { Module } from 'vuex';

export interface State {
  showFlyout: boolean;
}

const navigation: Module<State, any> = {
  namespaced: true,
  state: {
    showFlyout: false,
  },

  mutations: {
    SHOWFLYOUT(state, showFlyout) {
      state.showFlyout = showFlyout;
    },
  },

  getters: {
    getFlyout: (state) => state.showFlyout,
  },

  actions: {
    setShowFlyout({ commit }, showFlyout) {
      commit('SHOWFLYOUT', showFlyout);
    },
  },
};

export default navigation;
