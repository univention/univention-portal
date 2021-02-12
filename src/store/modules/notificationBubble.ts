import { Module } from 'vuex';

export interface State {
  visible: boolean;
  content: Object;
  visibleEmbedded: boolean;
  contentEmbedded: Object;
}

const bubble: Module<State, any> = {
  namespaced: true,
  state: {
    visible: true,
    content: {},
    visibleEmbedded: true,
    contentEmbedded: {},
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

    SHOW_EMBEDDED(state) {
      state.visible = true;
    },
    HIDE_EMBEDDED(state) {
      state.visible = false;
    },
    WRITE_CONTENT_EMBEDDED(state, payload) {
      state.content = payload;
    },
  },

  getters: {
    bubbleState: (state) => state.visible,
    bubbleContent: (state) => state.content,

    bubbleStateEmbedded: (state) => state.visible,
    bubbleContentEmbedded: (state) => state.content,
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

    setShowBubbleEmbedded({ commit }, payload) {
      commit('SHOW_EMBEDDED', payload);
    },
    setHideBubbleEmbedded({ commit }, payload) {
      commit('HIDE_EMBEDDED', payload);
    },
    setContentEmbedded({ commit }, payload) {
      commit('WRITE_CONTENT_EMBEDDED', payload);
    },
  },
};

export default bubble;
