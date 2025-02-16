# Feature Toggles

## Overview

The frontend does support feature toggles. The configuration of the feature
toggles is provided from the portal server as part of the portal data JSON.

## Feature Toggles state in the Vuex store

The state of the feature toggles state is embedded within the Vuex store in the
module `featureToggles`:

```typescript
const partialRootState = {
  featureToggles: {
    notifications_api: true,
  },
}
```

The state is updated as soon as possible once the portal data JSON has been
received from the portal server. See the store action `loadPortal` in the root
store.

## Checking Feature Toggles

Checking should be done with a regular if condition:

```typescript
if (this.$state.featureToggles.notifications_api) {
  // activate the feature
}
```

The values `false` and `undefined` indicate that the feature is not active. The
value `true` indicates that the feature is active.

## Adding or removing support for a new Feature Toggles

The supported Feature Toggles are defined in the type `FeatureToggles` within
the file
(featureToggles/models.ts)[../src/store/modules/featureToggles/models.ts].

## Updating Feature Toggles at run-time

Changing the state of a feature toggle at run-time is not guaranteed to be
supported. In a regular usage of the frontend the toggle state is defined by the
initial call to the portal data JSON endpoint.

The state of the `featureToggles` store module can be updated in the regular
Vuex ways and this may be useful in tests.

## During development

If the frontend is running in development mode with the stub portal data loaded
from `public/data/portal.json`, then feature toggles can be switched by changing
this file.

If the frontend is running together with a portal server, then the toggles are
configured via the portal server.

- In a Helm chart based deployment by changing the Helm chart's values
  configuration.

- In a direct deployment of the portal server's container the environment
  variable `PORTAL_SERVER_FEATURE_TOGGLES` has to be set accordingly.
