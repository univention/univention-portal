import { Module } from 'vuex';

export interface State {
  visible: boolean;
  visibleStandalone: boolean;
  visibleNew: boolean;
  content: Array<any>;
  contentOfNewNotification: Array<any>;
}

const bubble: Module<State, any> = {
  namespaced: true,
  state: {
    visible: false,
    visibleStandalone: false,
    visibleNew: false,
    content: [],
    contentOfNewNotification: [],
  },

  mutations: {
    WRITE_CONTENT(state, payload) {
      state.content = payload;
    },
    ADD_CONTENT(state, payload) {
      state.contentOfNewNotification = [];
      state.content.push(payload);
      state.contentOfNewNotification.push(payload);
    },
    SHOW(state) {
      state.visibleStandalone = true;
    },
    SHOW_NEW(state) {
      state.visibleNew = true;
    },
    SHOW_EMBEDDED(state) {
      state.visible = true;
      state.visibleStandalone = false;
      state.visibleNew = false;
    },
    HIDE(state) {
      state.visibleStandalone = false;
    },
    HIDE_NEW_NOTIFICATION(state) {
      state.visibleNew = false;
    },
    HIDE_ALL_NOTIFICATIONS(state) {
      state.visible = false;
      state.visibleStandalone = false;
      state.visibleNew = false;
    },
    DELETE_SINGLE_NOTIFICTION(state, token) {
      const indexContent = state.content.findIndex((notification) => notification.bubbleToken === token);
      const indexNewNotification = state.contentOfNewNotification.findIndex((notification) => notification.bubbleToken === token);
      state.content.splice(indexContent, 1);
      state.contentOfNewNotification.splice(indexNewNotification, 1);
    },
  },

  getters: {
    bubbleState: (state) => state.visible,
    bubbleStateStandalone: (state) => state.visibleStandalone,
    bubbleStateNewBubble: (state) => state.visibleNew,
    bubbleContent: (state) => state.content,
    bubbleContentNewNotification: (state) => state.contentOfNewNotification,
  },

  actions: {
    setShowBubble({ commit }, payload) {
      commit('SHOW', payload);
    },
    setShowNewBubble({ commit }, payload) {
      commit('SHOW_NEW', payload);
    },
    setHideBubble({ commit }, payload) {
      commit('HIDE', payload);
    },
    setHideNewBubble({ commit }) {
      commit('HIDE_NEW_NOTIFICATION');
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
