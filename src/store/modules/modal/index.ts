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

export interface ModalState {
  modalVisible: boolean;
  modalComponent: string | null;
  modalProps: Record<string, string>;
  modalStubborn: boolean;
  modalResolve: (any) => void;
  modalReject: () => void;
  modalError: Array<unknown>;
}

const modal: PortalModule<ModalState> = {
  namespaced: true,
  state: {
    modalVisible: false,
    modalComponent: null,
    modalProps: {},
    modalStubborn: false,
    modalResolve: (() => undefined),
    modalReject: (() => undefined),
    modalError: [],
  },

  mutations: {
    SET_MODAL(state, payload) {
      state.modalComponent = payload.name;
      state.modalProps = payload.props || {};
      state.modalStubborn = payload.stubborn || false;
      document.body.classList.add('body__has-modal');
      state.modalResolve = payload.resolve || (() => undefined);
      state.modalReject = payload.reject || (() => undefined);
    },
    CLEAR_MODAL(state) {
      state.modalComponent = null;
      state.modalProps = {};
      state.modalStubborn = false;
      document.body.classList.remove('body__has-modal');
      state.modalResolve = () => undefined;
      state.modalReject = () => undefined;
    },
    SHOW_MODAL(state) {
      state.modalVisible = true;
      document.body.classList.add('body__has-modal');
    },
    HIDE_MODAL(state) {
      state.modalVisible = false;
      document.body.classList.remove('body__has-modal');
    },
    MODAL_ERROR(state, payload) {
      state.modalError.push(payload);
    },
    MODAL_ERROR_REMOVE(state, payload) {
      const arr = state.modalError;
      let i = 0;

      // function arrayRemove(arr, payload) {
      //   return arr.filter(function(ele){
      //     return ele !== payload;
      //   });
      // }

      // console.log('MODAL_ERROR_REMOVE - payload: ', payload);

      if (arr.includes(payload)) {
        // delete state.modalError[payload];
        // arrayRemove(arr, payload);
        console.log('MODAL_ERROR_REMOVE - inside: ', payload);
        for (i; i < arr.length; i += 1) {
          if (arr[i] === payload) {
            arr.splice(i, 1);
          }
        }
      }
    },
  },

  getters: {
    getModalState: (state) => state.modalVisible,
    getModalComponent: (state) => state.modalComponent,
    getModalProps: (state) => state.modalProps,
    getModalStubborn: (state) => state.modalStubborn,
    getModalError: (state) => state.modalError,
  },

  actions: {
    setAndShowModal({ commit }, payload) {
      commit('SET_MODAL', payload);
      commit('SHOW_MODAL');
    },
    showModal({ commit }) {
      commit('SHOW_MODAL');
    },
    setShowModalPromise({ dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch('setAndShowModal', { ...payload, resolve, reject });
      });
    },
    hideAndClearModal({ commit }) {
      commit('HIDE_MODAL');
      commit('CLEAR_MODAL');
    },
    resolve({ state }, payload) {
      state.modalResolve(payload);
    },
    reject({ state }) {
      state.modalReject();
    },
    setModalError({ commit }, payload) {
      commit('MODAL_ERROR', payload);
    },
    removeModalErrorItem({ commit }, payload) {
      commit('MODAL_ERROR_REMOVE', payload);
    },
  },
};

export default modal;
