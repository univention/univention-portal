/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

/* eslint-disable camelcase */

export type FeatureToggles = {
  // The toggle names use snake case consistently throughout the stack.
  centered_layout?: boolean;
  notifications_api?: boolean;
  umc_session_refresh?: boolean;
  welcome_message?: boolean;
};

/* eslint-enable camelcase */

export type FeatureTogglesState = FeatureToggles;

export const initialFeatureTogglesState: FeatureTogglesState = {};
