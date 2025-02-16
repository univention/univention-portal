/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { createStore } from 'vuex';

import featureToggles from '@/store/modules/featureToggles';
import { FeatureTogglesState } from '@/store/modules/featureToggles/models';

export function createStubStore(initialState?: FeatureTogglesState) {
  const store = createStore<any>({
    modules: {
      featureToggles: {
        ...featureToggles,
        state: {
          ...featureToggles.state,
          ...initialState,
        },
      },
    },
  });
  return store;
}

export default createStubStore;
