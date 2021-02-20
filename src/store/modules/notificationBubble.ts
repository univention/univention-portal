import { Module } from 'vuex';

export interface State {
  visible: boolean;
  visibleStandalone: boolean;
  content: Array<any>;
}

const bubble: Module<State, any> = {
  namespaced: true,
  state: {
    visible: false,
    visibleStandalone: false,
    content: [],
  },

  mutations: {
    WRITE_CONTENT(state, payload) {
      state.content = payload;
    },
    ADD_CONTENT(state, payload) {
      state.content.push(payload);
    },
    SHOW(state) {
      state.visibleStandalone = true;
    },
    SHOW_EMBEDDED(state) {
      state.visible = true;
      state.visibleStandalone = false;
    },
    HIDE(state) {
      state.visibleStandalone = false;
    },
    HIDE_ALL_NOTIFICATIONS(state) {
      state.visible = false;
      state.visibleStandalone = false;
    },
    DELETE_SINGLE_NOTIFICTION(state, token) {
      const index = state.content.findIndex((notification) => notification.bubbleToken === token);
      state.content.splice(index, 1);
    },
  },

  getters: {
    bubbleState: (state) => state.visible,
    bubbleStateStandalone: (state) => state.visibleStandalone,
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
    addContent({ commit }, payload) {
      commit('ADD_CONTENT', payload);
    },
    hideAllNotifications({ commit }, payload) {
      commit('HIDE_ALL_NOTIFICATIONS', payload);
    },
    showEmbedded({ commit }, payload) {
      commit('SHOW_EMBEDDED', payload);
    },
    deleteSingleNotification({ commit }, token) {
      commit('DELETE_SINGLE_NOTIFICTION', token);
    },
  },
};

export default bubble;
