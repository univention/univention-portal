/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

export type FeatureToggles = {
  umc_session_refresh?: boolean;
  notifications_api?: boolean;
};

export type FeatureTogglesState = FeatureToggles;

export const initialFeatureTogglesState: FeatureTogglesState = {
};
