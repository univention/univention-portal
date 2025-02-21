/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { mutations } from '@/store/modules/featureToggles';
import { createStubStore } from './stubs';

describe('Mutation setFeatureToggles', () => {
  test('updates state from payload', () => {
    const featureToggleConfiguration = {
      notifications_api: true,
      umc_session_refresh: false,
      centered_layout: false,
    };
    const stubState = {};
    mutations.setFeatureToggles(stubState, featureToggleConfiguration);
    expect(stubState).toMatchObject(featureToggleConfiguration);
  });
});

describe('Store Module featureToggles', () => {
  test('has an empty initial state', () => {
    const stubStore = createStubStore();
    expect(stubStore.state.featureToggles).toEqual({});
  });

  test('allows to update feature toggles', () => {
    const stubStore = createStubStore();
    const newFeatureToggles = {
      notifications_api: true,
      umc_session_refresh: true,
      centered_layout: true,
    };
    stubStore.commit('featureToggles/setFeatureToggles', newFeatureToggles);
    expect(newFeatureToggles).toMatchObject(stubStore.state.featureToggles);
  });
});
