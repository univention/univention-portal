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
import { Commit } from 'vuex';
import { PortalModule } from '@/store/root.models';

export interface ModalState {
  firstLevelModal: {
    modalVisible: boolean;
    modalComponent: string | null;
    modalProps: Record<string, string>;
    modalStubborn: boolean;
    modalResolve: (any) => void;
    modalReject: () => void;
  }
  secondLevelModal: {
    modalVisible: boolean;
    modalComponent: string | null;
    modalProps: Record<string, string>;
    modalStubborn: boolean;
    modalResolve: (any) => void;
    modalReject: () => void;
  }
}

const modal: PortalModule<ModalState> = {
  namespaced: true,
  state: {
    firstLevelModal: {
      modalVisible: false,
      modalComponent: null,
      modalProps: {},
      modalStubborn: false,
      modalResolve: (() => undefined),
      modalReject: (() => undefined),
    },
    secondLevelModal: {
      modalVisible: false,
      modalComponent: null,
      modalProps: {},
      modalStubborn: false,
      modalResolve: (() => undefined),
      modalReject: (() => undefined),
    },
  },

  mutations: {
    SET_MODAL(state: ModalState, payload): void {
      const modalLevel = payload.level === 2 ? 'secondLevelModal' : 'firstLevelModal';

      state[modalLevel].modalComponent = payload.name;
      state[modalLevel].modalProps = payload.props || {};
      state[modalLevel].modalStubborn = payload.stubborn || false;
      document.body.classList.add('body--has-modal');
      state[modalLevel].modalResolve = payload.resolve || (() => undefined);
      state[modalLevel].modalReject = payload.reject || (() => undefined);
    },
    CLEAR_MODAL(state: ModalState, payload): void {
      const modalLevel = payload === 2 ? 'secondLevelModal' : 'firstLevelModal';
      state[modalLevel].modalComponent = null;
      state[modalLevel].modalProps = {};
      state[modalLevel].modalStubborn = false;
      document.body.classList.remove('body--has-modal');
      state[modalLevel].modalResolve = () => undefined;
      state[modalLevel].modalReject = () => undefined;
    },
    SHOW_MODAL(state: ModalState, payload): void {
      const modalLevel = payload === 2 ? 'secondLevelModal' : 'firstLevelModal';
      state[modalLevel].modalVisible = true;
      document.body.classList.add('body--has-modal');
    },
    HIDE_MODAL(state: ModalState, payload): void {
      const modalLevel = payload === 2 ? 'secondLevelModal' : 'firstLevelModal';
      state[modalLevel].modalVisible = false;
      document.body.classList.remove('body--has-modal');
    },
  },

  getters: {
    getModalState: (state) => (level: string) => state[level].modalVisible,
    getModalComponent: (state) => (level: string) => state[level].modalComponent,
    getModalProps: (state) => (level: string) => state[level].modalProps,
    getModalStubborn: (state) => (level: string) => state[level].modalStubborn,
  },

  actions: {
    setAndShowModal({ commit, dispatch }, payload): void {
      commit('SET_MODAL', payload);
      commit('SHOW_MODAL', payload.level);
      const activityLevel = payload.level === 2 ? 'modal2' : 'modal';
      dispatch('activity/setLevel', activityLevel, { root: true });
    },
    setShowModalPromise({ dispatch }, payload): Promise<void> {
      return new Promise((resolve, reject) => {
        dispatch('setAndShowModal', { ...payload, resolve, reject });
      });
    },
    hideAndClearModal({ getters, commit, dispatch }, payload?: number): void {
      if (getters.getModalState) {
        const activityLevel = payload === 2 ? 'modal' : 'portal';
        dispatch('activity/setLevel', activityLevel, { root: true });
      }
      commit('HIDE_MODAL', payload);
      commit('CLEAR_MODAL', payload);
    },
    resolve({ state }: { state: ModalState }, payload): void {
      const modalLevel = payload.level === 2 ? 'secondLevelModal' : 'firstLevelModal';
      state[modalLevel].modalResolve(payload);
    },
    reject({ state }: { state: ModalState }, payload?: number): void {
      const modalLevel = payload === 2 ? 'secondLevelModal' : 'firstLevelModal';
      state[modalLevel].modalReject();
    },
  },
};

export default modal;
