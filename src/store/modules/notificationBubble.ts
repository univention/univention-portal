import { Module } from 'vuex';

export interface State {
  visible: boolean;
  content: Object;
}

const bubble: Module<State, any> = {
  namespaced: true,
  state: {
    visible: true,
    content: {},
  },

  mutations: {
    SHOW(state) {
      state.visible = true;
    },
    HIDE(state) {
      state.visible = false;
    },
    WRITE_CONTENT(state, payload) {
      state.content = payload;
    },
  },

  getters: {
    bubbleState: (state) => state.visible,
    bubbleContent: (state) => state.content,
  },

  actions: {
    setShowBubble({ commit }, payload) {
      commit('SHOW', payload);
    },
    setHideBubble({ commit }, payload) {
      commit('HIDE', payload);
    },
    setContent({ commit }, payload) {
      commit('WRITE_CONTENT', payload);
    },
  },
};

export default bubble;
