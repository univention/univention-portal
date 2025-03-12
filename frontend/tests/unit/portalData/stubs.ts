/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

// import { createStore } from 'vuex';

import portalData from '@/store/modules/portalData';
// import { PortalDataState } from '@/store/modules/portalData/portalData.models';
// import { RootState } from '@/store/root.models';

// interface MyRootState extends RootState {
//   portalData: PortalDataState,
// }

export function createStubStore(initialState?: any) {
  // console.log(portalData);
  // const store = createStore<MyRootState>({
    // modules: {
      // portalData: {
  //       ...portalData,
  //       state: {
  //         ...portalData.state,
  //         ...initialState,
  //       },
      // },
    // },
  // });
  return "stub";
  // return store;
}

export default createStubStore;
