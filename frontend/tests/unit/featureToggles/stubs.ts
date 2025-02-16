/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { createStore } from 'vuex';

import featureToggles from '@/store/modules/featureToggles';
import { FeatureTogglesState } from '@/store/modules/featureToggles/models';
import { RootState } from '@/store/root.models';

interface MyRootState extends RootState {
  featureToggles: FeatureTogglesState,
}

export function createStubStore(initialState?: FeatureTogglesState) {
  const store = createStore<MyRootState>({
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
