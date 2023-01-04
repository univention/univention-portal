
Helm chart for the Univention Portal

Copy the `*.example` files and adjust them for the current environment.

Install the charts with
`helm install <parameters> (notifications-api|portal-frontend|portal-server) ./(notifications-api|portal-frontend|portal-server)`

Add custom values with the
`--values values-(frontend|notifications-api|server).yaml`
parameter.
See
`values-(frontend|notifications-api|server).yaml.example`
files for important values.
Other changeable parameters can be found in the `values.yaml`
files of the respective project-directories.

Add a namespace-parameter to install avoid using the `default`-namespace.
I.e. `--namespace poco`

## General helm hints

See the templated output with `helm template ./portal-server/`

Remove the server-chart with `helm --namespace poco uninstall portal-server`

## General kubectl hints

Show status of the replica-set with `kubectl --namespace poco describe ReplicaSet`

Show installed Services with `kubectl --namespace poco get service`

Show running pods with `kubectl --namespace poco get pods`

Show endpoints with `kubectl --namespace poco get endpoints`

Show deployments with `kubectl --namespace poco get deployments`
