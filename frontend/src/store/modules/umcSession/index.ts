/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

import { ActionContext } from 'vuex';

import { PortalActionContext, PortalModule } from '../../root.models';

export interface UmcSessionState {
}

export type UmcSessionActionContext = PortalActionContext<UmcSessionState>;

const umcSession: PortalModule<UmcSessionState> = {

  namespaced: true,

  state: {
  },

  mutations: {
  },

  getters: {
  },

  actions: {
    /**
     * Start the regular refresh of the UMC Session.
     */
    startSessionRefresh({ dispatch, getters }: UmcSessionActionContext): void {
      console.warn('TODO: implement me!');
    },
  },
};

export default umcSession;
