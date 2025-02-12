# Feature Toggles

The portal has support for feature toggles which can be configured at deployment
time.


## `portal-server`

The portal server does expect feature toggles to be configured via the regular
configuration file.

The feature configuration is provided to the `portal-frontend` via the key
`features` in the `portal.json` data structure.


