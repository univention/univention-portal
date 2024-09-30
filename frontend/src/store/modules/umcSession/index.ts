/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

import { PortalActionContext, PortalModule } from '../../root.models';
import { umcGetSessionInfo, UmcSessionInfo } from './utils';

export interface UmcSessionState {
  refreshNeeded: boolean,
}

export type UmcSessionActionContext = PortalActionContext<UmcSessionState>;

export const refreshBeforeExpiry = 5;

export const actions = {
  async startSessionRefresh({ dispatch }: UmcSessionActionContext): Promise<void> {
    let result : UmcSessionInfo | undefined;
    let refreshInSeconds = 0;

    try {
      result = await umcGetSessionInfo();
    } catch (error) {
      console.warn('Fetching UMC session information failed, disabling passive session refresh.');
      return;
    }
    if (result) {
      refreshInSeconds = result.remaining - refreshBeforeExpiry;
    }
    setTimeout(() => dispatch('refreshNeeded'), refreshInSeconds * 1000);
  },

  refreshNeeded({ commit }: UmcSessionActionContext): void {
    commit('refreshNeeded');
  },
};

const umcSession: PortalModule<UmcSessionState> = {

  namespaced: true,

  state: {
    refreshNeeded: false,
  },

  mutations: {
    refreshNeeded(state: UmcSessionState): void {
      state.refreshNeeded = true;
    },
  },

  getters: {
    refreshNeeded: (state) => state.refreshNeeded,
  },

  actions,
};

export default umcSession;
