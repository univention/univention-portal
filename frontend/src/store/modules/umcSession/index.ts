/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

import { PortalActionContext, PortalModule } from '../../root.models';
import { umcGetSessionInfo, UmcSessionInfo } from './utils';

export interface UmcSessionState {
  refreshNeeded: boolean,
  refreshTimer?: number,
}

export type UmcSessionActionContext = PortalActionContext<UmcSessionState>;

export const refreshBeforeExpiry = 5;

export const actions = {
  async startSessionRefresh({ commit, state }: UmcSessionActionContext): Promise<void> {
    let result : UmcSessionInfo | undefined;
    let refreshInSeconds = 0;

    if (state.refreshTimer) {
      clearTimeout(state.refreshTimer);
      commit('setTimer', undefined);
    }

    try {
      result = await umcGetSessionInfo();
    } catch (error) {
      console.warn('Fetching UMC session information failed, disabling passive session refresh.');
      return;
    }
    if (result) {
      refreshInSeconds = result.remaining - refreshBeforeExpiry;
    }
    const timerId = setTimeout(() => {
      commit('setTimer', undefined);
      commit('refreshNeeded', true);
    }, refreshInSeconds * 1000);
    commit('setTimer', timerId);
  },

  async restartSessionRefresh({ commit, dispatch }) {
    commit('refreshNeeded', false);
    await dispatch('startSessionRefresh');
  },

  async disableSessionRefresh({ commit, state }) {
    commit('refreshNeeded', false);
    if (state.refreshTimer) {
      clearTimeout(state.refreshTimer);
      commit('setTimer', undefined);
    }
  },

};

export const mutations = {
  refreshNeeded(state: UmcSessionState, payload: boolean): void {
    state.refreshNeeded = payload;
  },

  setTimer(state: UmcSessionState, timerId: number | undefined): void {
    state.refreshTimer = timerId;
  },

};

const umcSession: PortalModule<UmcSessionState> = {

  namespaced: true,

  state: {
    refreshNeeded: false,
    refreshTimer: undefined,
  },

  getters: {
    refreshNeeded: (state) => state.refreshNeeded,
  },

  mutations,
  actions,
};

export default umcSession;
