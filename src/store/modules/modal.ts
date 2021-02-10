import { Module } from 'vuex';

export interface State {
  modalVisible: boolean;
  modalComponent: any;
}

const modal: Module<State, any> = {
  namespaced: true,
  state: {
    modalVisible: false,
    modalComponent: null,
  },

  mutations: {
    SHOWMODAL(state, componentName) {
      state.modalVisible = true;
      state.modalComponent = componentName;
    },
    HIDEMODAL(state) {
      state.modalVisible = false;
    },
  },

  getters: {
    modalState: (state) => state.modalVisible,
  },

  actions: {
    setShowModal({ commit }, showModal) {
      commit('SHOWMODAL', showModal);
    },
    setHideModal({ commit }, hideModal) {
      commit('HIDEMODAL', hideModal);
    },
  },
};

export default modal;
