# Feature Toggles

The portal has support for feature toggles which can be configured at deployment
time.

The portal server does expect feature toggles to be configured via the regular
configuration file. See (`configuration.md`)[configuration.md].

The feature configuration is provided to the `portal-frontend` via the key
`feature_toggles` in the `portal.json` data structure.


