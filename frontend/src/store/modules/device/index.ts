/*
  * SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  * SPDX-License-Identifier: AGPL-3.0-only
  */

import { Module } from 'vuex';
import { RootState } from '@/store/root.models';

export interface DeviceState {
  isTouchDevice: boolean;
}

const state: DeviceState = {
  isTouchDevice: 'ontouchstart' in document.documentElement,
};

const getters = {
  isTouchDevice: (deviceState: DeviceState): boolean => deviceState.isTouchDevice,
};

const device: Module<DeviceState, RootState> = {
  namespaced: true,
  state,
  getters,
};

export default device;
