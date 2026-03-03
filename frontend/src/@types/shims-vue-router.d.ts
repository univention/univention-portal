/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

// Manually augment ComponentCustomProperties with $route and $router.
//
// The triple-slash reference directive (/// <reference types="vue-router" />)
// does not work here because vue-router 4.6.4 ships its type declarations as
// .d.mts files, which TypeScript 4.5.5 with moduleResolution "node" cannot
// resolve. Instead, we replicate the augmentation explicitly, following the
// same pattern used for Vuex in shims-vuex.d.ts.

import type { Router, RouteLocationNormalizedLoaded } from 'vue-router';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $route: RouteLocationNormalizedLoaded;
    $router: Router;
  }
}
