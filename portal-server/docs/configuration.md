# Portal Server Configuration


## Development Mode

The portal server does support to be started in development mode. The
configuration can only be applied based on an environment variable:

```shell
export PORTAL_SERVER_DEVELOPMENT_MODE=true
```

See:

- [Debug mode](https://www.tornadoweb.org/en/stable/guide/running.html#debug-mode-and-automatic-reloading)
  in the documentation of the Tornado framework.


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
