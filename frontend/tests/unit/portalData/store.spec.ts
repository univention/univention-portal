/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

// import { createStubStore } from './stubs';

import portalData from "@/store/modules/portalData";
// import featureToggles from "@/store/modules/featureToggles";

describe('Store Module portalData', () => {
  test('has an empty initial state', () => {
    // const stubStore = createStubStore();
    // expect(stubStore.state.portalData).toEqual({});
    console.log("start");
    // TODO: If I comment this out, then the test executes.
    // If this line is not commented, then a TypeError is raised.
    //
    // Test run via:
    //
    // yarn test:unit tests/unit/portalData/store.spec.ts

    console.log(portalData);
    // console.log(featureToggles);
    expect(false).toBe(true);
  });

});
