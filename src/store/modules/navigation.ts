const navigation = {
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
