# Portal Server Configuration

## Feature Toggles

The configuration of feature toggles can be provided in the key
`feature_toggles` and has to be a mapping from strings to boolean values.

The following example shows a configuration which enables the Notifications API:

```json
{
  "feature_toggles": {
    "notifications_api": True
  }
}
```

The container does require the configuration to be in the environment variable
`PORTAL_SERVER_FEATURE_TOGGLES` as a JSON value:

```
PORTAL_SERVER_FEATURE_TOGGLES='{"notifications_api": true}'
```
