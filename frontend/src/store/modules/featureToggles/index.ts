/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { PortalModule } from '../../root.models';
import { FeatureToggles, FeatureTogglesState, initialFeatureTogglesState } from './models';

export const mutations = {
  setFeatureToggles(state: FeatureTogglesState, payload: FeatureToggles): void {
    Object.assign(state, payload);
  },
};

const featureToggles: PortalModule<FeatureTogglesState> = {
  namespaced: true,
  state: initialFeatureTogglesState,
  getters: {
    featureToggles: (state: FeatureTogglesState) => state,
  },
  mutations,
};

export default featureToggles;
