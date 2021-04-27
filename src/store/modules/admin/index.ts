/*
 * Copyright 2021 Univention GmbH
 *
 * https://www.univention.de/
 *
 * All rights reserved.
 *
 * The source code of this program is made available
 * under the terms of the GNU Affero General Public License version 3
 * (GNU AGPL V3) as published by the Free Software Foundation.
 *
 * Binary versions of this program provided by Univention to you as
 * well as other copyrighted, protected or trademarked materials like
 * Logos, graphics, fonts, specific documentations and configurations,
 * cryptographic keys etc. are subject to a license agreement between
 * you and Univention and not subject to the GNU AGPL V3.
 *
 * In the case you use this program under the terms of the GNU AGPL V3,
 * the program is provided in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License with the Debian GNU/Linux or Univention distribution in file
 * /usr/share/common-licenses/AGPL-3; if not, see
 * <https://www.gnu.org/licenses/>.
 */
import { PortalModule } from '@/store/root.models';

export interface AdminState {
  showModal: boolean,
  currentModal: string,
  modalVariant: string,
  entryStep: number,
  innerModal: boolean,
  tileObject: Record<string, unknown>, // Object
  showModalPagination: boolean,
  saveAction: string,
  removeAction: string,
  modalTitle: string,
  modalClass: string,
  categoryIndex: number,
  categoryTitle: string,
}

const modal: PortalModule<AdminState> = {
  namespaced: true,
  state: {
    showModal: false,
    currentModal: '',
    modalVariant: '',
    entryStep: 0,
    innerModal: false,
    tileObject: {},
    showModalPagination: false,
    saveAction: '',
    removeAction: '',
    modalTitle: '',
    modalClass: '',
    categoryIndex: 0,
    categoryTitle: '',
  },

  mutations: {
    SET_SHOW_MODAL(state, payload) {
      state.showModal = payload;
    },
    SET_CURRENT_MODAL(state, payload) {
      state.currentModal = payload;
    },
    SET_MODAL_VARIANT(state, payload) {
      state.modalVariant = payload;
    },
    SET_STEP(state, payload) {
      state.entryStep = payload;
    },
    SET_INNER_MODAL(state, payload) {
      state.innerModal = payload;
    },
    SET_TILE_OBJECT(state, payload) {
      state.tileObject = payload;
    },
    SET_SHOW_MODAL_PAGINATION(state, payload) {
      state.showModalPagination = payload;
    },
    SET_SAVE_ACTION(state, payload) {
      state.saveAction = payload;
    },
    SET_REMOVE_ACTION(state, payload) {
      state.removeAction = payload;
    },
    SET_MODAL_TITLE(state, payload) {
      state.modalTitle = payload;
    },
    SET_MODAL_CLASS(state, payload) {
      state.modalClass = payload;
    },
    SET_CATEGORY_INDEX(state, payload) {
      state.categoryIndex = payload;
    },
    SET_CATEGORY_TITLE(state, payload) {
      state.categoryTitle = payload;
    },
  },

  getters: {
    getShowModal: (state) => state.showModal,
    getCurrentModal: (state) => state.currentModal,
    getModalVariant: (state) => state.modalVariant,
    getEntryStep: (state) => state.entryStep,
    getInnerModal: (state) => state.innerModal,
    getTileObject: (state) => state.tileObject,
    getShowModalPagination: (state) => state.showModalPagination,
    getSaveAction: (state) => state.saveAction,
    getRemoveAction: (state) => state.removeAction,
    getModalTitle: (state) => state.modalTitle,
    getModalClass: (state) => state.modalClass,
    getCategoryIndex: (state) => state.categoryIndex,
    getCategoryTitle: (state) => state.categoryTitle,
  },

  actions: {
    setShowModal({ commit }, payload) {
      commit('SET_SHOW_MODAL', payload);
    },
    setCurrentModal({ commit }, payload) {
      commit('SET_CURRENT_MODAL', payload);
    },
    setModalVariant({ commit }, payload) {
      commit('SET_MODAL_VARIANT', payload);
    },
    setEntryStep({ commit }, payload) {
      commit('SET_STEP', payload);
    },
    setInnerModal({ commit }, payload) {
      commit('SET_INNER_MODAL', payload);
    },
    setTileObject({ commit }, payload) {
      commit('SET_TILE_OBJECT', { ...payload });
    },
    setShowModalPagination({ commit }, payload) {
      commit('SET_SHOW_MODAL_PAGINATION', payload);
    },
    setSaveAction({ commit }, payload) {
      commit('SET_SAVE_ACTION', payload);
    },
    setRemoveAction({ commit }, payload) {
      commit('SET_REMOVE_ACTION', payload);
    },
    setModalTitle({ commit }, payload) {
      commit('SET_MODAL_TITLE', payload);
    },
    setModalClass({ commit }, payload) {
      commit('SET_MODAL_CLASS', payload);
    },
    updateTileObject({ commit }, payload) {
      console.log('updateTileObject');
      console.log('payload: ', payload);
      commit('SET_TILE_OBJECT', { ...payload });
    },
    setCategoryIndex({ commit }, payload) {
      console.log('setCategoryIndex');
      console.log('payload: ', payload);
      commit('SET_CATEGORY_INDEX', payload);
    },
    setCategoryTitle({ commit }, payload) {
      console.log('setCategoryTitle');
      console.log('payload: ', payload);
      commit('SET_CATEGORY_TITLE', payload);
    },
  },
};

export default modal;
