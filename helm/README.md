
Helm chart for the Univention Portal

Copy the `*.example` files and adjust them for the current environment.

Install the Frontend with `helm install --values frontend-values.yaml portal-frontend ./portal-frontend`

Install the Server with `helm install --values server-values.yaml portal-server ./portal-server`
