/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

/* eslint-disable camelcase */

export type FeatureToggles = {
  // The toggle names use snake case consistently throughout the stack.
  umc_session_refresh?: boolean;
  notifications_api?: boolean;
};

/* eslint-enable camelcase */

export type FeatureTogglesState = FeatureToggles;

export const initialFeatureTogglesState: FeatureTogglesState = {};
