# portal-frontend

A Helm chart for the Univention Portal Frontend

- **Version**: 0.1.0
- **Type**: application
- **AppVersion**: 1.16.0
- **Homepage:** <https://www.univention.de/>

## TL;DR

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-frontend univention-portal/portal-frontend
```

## Introduction

This chart does install the Frontend of the Univention Portal.

The Frontend is a fully stateless component, no special handling of persistent
volumes or similar is needed.

## Installing

To install the chart with the release name `portal-frontend`:

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-frontend univention-portal/portal-frontend
```

### Customization

If `istio` is in use, then injecting a custom CSS styling needs special care.
The parameter `istio.pathOverrides` is provided as a workaround for such a
deployment scenario.

A custom version of the file `custom.css` can be injected with the following
example configuration:

```yaml
pathOverrides:
  - match: "exact"
    path: "/univention/portal/css/custom.css"
    route:
      - destination:
          port:
            number: 80
          host: "example-service"
```

## Uninstalling

To uninstall the chart with the release name `portal-frontend`:

```console
helm uninstall portal-frontend
```

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| oci://artifacts.software-univention.de/nubus/charts | nubus-common | 0.28.0 |

## Values

<table>
	<thead>
		<th>Key</th>
		<th>Type</th>
		<th>Default</th>
		<th>Description</th>
	</thead>
	<tbody>
		<tr>
			<td>additionalAnnotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Additional custom annotations to add to all deployed objects.</td>
		</tr>
		<tr>
			<td>additionalLabels</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Additional custom labels to add to all deployed objects.</td>
		</tr>
		<tr>
			<td>affinity</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Affinity for pod assignment. Ref: https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity Note: podAffinityPreset, podAntiAffinityPreset, and nodeAffinityPreset will be ignored when it's set.</td>
		</tr>
		<tr>
			<td>assetLoader</td>
			<td>object</td>
			<td><pre lang="json">
{
  "config": {
    "pollInterval": 10
  },
  "image": {
    "pullPolicy": "",
    "registry": "",
    "repository": "nubus-dev/images/portal-asset-loader",
    "tag": "latest"
  },
  "livenessProbe": {
    "failureThreshold": 3,
    "httpGet": {
      "path": "/healthz",
      "port": 8080
    },
    "initialDelaySeconds": 10,
    "periodSeconds": 30
  },
  "readinessProbe": {
    "httpGet": {
      "path": "/healthz",
      "port": 8080
    },
    "initialDelaySeconds": 5,
    "periodSeconds": 10
  },
  "resources": {
    "limits": {
      "cpu": "100m",
      "memory": "128Mi"
    },
    "requests": {
      "cpu": "50m",
      "memory": "64Mi"
    }
  },
  "startupProbe": {
    "failureThreshold": 10,
    "initialDelaySeconds": 5,
    "periodSeconds": 10,
    "successThreshold": 1,
    "tcpSocket": {
      "port": 8080
    },
    "timeoutSeconds": 5
  }
}
</pre>
</td>
			<td>Asset loader sidecar configuration for loading portal assets.</td>
		</tr>
		<tr>
			<td>assetLoader.config.pollInterval</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td>UDM Polling interval for portal config changes</td>
		</tr>
		<tr>
			<td>assetLoader.image</td>
			<td>object</td>
			<td><pre lang="json">
{
  "pullPolicy": "",
  "registry": "",
  "repository": "nubus-dev/images/portal-asset-loader",
  "tag": "latest"
}
</pre>
</td>
			<td>Backend to use for asset loading: "ldap" or "nats"</td>
		</tr>
		<tr>
			<td>assetLoader.resources</td>
			<td>object</td>
			<td><pre lang="json">
{
  "limits": {
    "cpu": "100m",
    "memory": "128Mi"
  },
  "requests": {
    "cpu": "50m",
    "memory": "64Mi"
  }
}
</pre>
</td>
			<td>Resource limits for the asset-loader sidecar container.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.allowPrivilegeEscalation</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Enable container privileged escalation.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.capabilities</td>
			<td>object</td>
			<td><pre lang="json">
{
  "drop": [
    "ALL"
  ]
}
</pre>
</td>
			<td>Security capabilities for container.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable security context.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.privileged</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>containerSecurityContext.readOnlyRootFilesystem</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Mounts the container's root filesystem as read-only.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.runAsGroup</td>
			<td>int</td>
			<td><pre lang="json">
1000
</pre>
</td>
			<td>Process group id.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.runAsNonRoot</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Run container as a user.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.runAsUser</td>
			<td>int</td>
			<td><pre lang="json">
1000
</pre>
</td>
			<td>Process user id.</td>
		</tr>
		<tr>
			<td>containerSecurityContext.seccompProfile.type</td>
			<td>string</td>
			<td><pre lang="json">
"RuntimeDefault"
</pre>
</td>
			<td>Disallow custom Seccomp profile by setting it to RuntimeDefault.</td>
		</tr>
		<tr>
			<td>extraEnvVars</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Array with extra environment variables to add to containers.  extraEnvVars:   - name: FOO     value: "bar"</td>
		</tr>
		<tr>
			<td>extraIngresses</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Extra ingress configuration Ingress paths for the portal frontend are defined in the ingress template Use extraIngresses to add additional custom ingress resources.</td>
		</tr>
		<tr>
			<td>extraSecrets</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Optionally specify a secret to create (primarily intended to be used in development environments to provide custom certificates)</td>
		</tr>
		<tr>
			<td>extraVolumeMounts</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Optionally specify an extra list of additional volumeMounts.</td>
		</tr>
		<tr>
			<td>extraVolumes</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Optionally specify an extra list of additional volumes.</td>
		</tr>
		<tr>
			<td>fullnameOverride</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Provide a name to substitute for the full names of resources.</td>
		</tr>
		<tr>
			<td>global.configMapUcr</td>
			<td>string</td>
			<td><pre lang="json">
"stack-data-ums-ucr"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define an ImagePullPolicy.  Ref.: https://kubernetes.io/docs/concepts/containers/images/#image-pull-policy  "IfNotPresent" => The image is pulled only if it is not already present locally. "Always" => Every time the kubelet launches a container, the kubelet queries the container image registry to             resolve the name to an image digest. If the kubelet has a container image with that exact digest cached             locally, the kubelet uses its cached image; otherwise, the kubelet pulls the image with the resolved             digest, and uses that image to launch the container. "Never" => The kubelet does not try fetching the image. If the image is somehow already present locally, the            kubelet attempts to start the container; otherwise, startup fails.</td>
		</tr>
		<tr>
			<td>global.imagePullSecrets</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Credentials to fetch images from private registry. Ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/  imagePullSecrets:   - "docker-registry"</td>
		</tr>
		<tr>
			<td>global.imageRegistry</td>
			<td>string</td>
			<td><pre lang="json">
"artifacts.software-univention.de"
</pre>
</td>
			<td>Container registry address.</td>
		</tr>
		<tr>
			<td>global.udm.connection.url</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Global default for the URL via which the UDM Rest API can be reached. See "udm.connection.url".</td>
		</tr>
		<tr>
			<td>image.pullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.registry</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"nubus-dev/images/portal-frontend"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.tag</td>
			<td>string</td>
			<td><pre lang="json">
"latest"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>imagePullSecrets</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Credentials to fetch images from private registry. Ref: https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/  imagePullSecrets:   - "docker-registry"</td>
		</tr>
		<tr>
			<td>ingress.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Define custom ingress annotations for all Ingresses.</td>
		</tr>
		<tr>
			<td>ingress.certManager.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable cert-manager.io annotaion.</td>
		</tr>
		<tr>
			<td>ingress.certManager.issuerRef.kind</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIssuer"
</pre>
</td>
			<td>Type of Issuer, f.e. "Issuer" or "ClusterIssuer".</td>
		</tr>
		<tr>
			<td>ingress.certManager.issuerRef.name</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Name of cert-manager.io Issuer resource.</td>
		</tr>
		<tr>
			<td>ingress.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable creation of Ingress.</td>
		</tr>
		<tr>
			<td>ingress.host</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Define the Fully Qualified Domain Name (FQDN) where application should be reachable. (This will be the default for all Ingresses)</td>
		</tr>
		<tr>
			<td>ingress.ingressClassName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>The Ingress controller class name. (This will be the default for all Ingresses)</td>
		</tr>
		<tr>
			<td>ingress.tls</td>
			<td>object</td>
			<td><pre lang="json">
{
  "enabled": true,
  "secretName": ""
}
</pre>
</td>
			<td>Secure an Ingress by specifying a Secret that contains a TLS private key and certificate.  Ref.: https://kubernetes.io/docs/concepts/services-networking/ingress/#tls</td>
		</tr>
		<tr>
			<td>ingress.tls.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable TLS/SSL/HTTPS for Ingress.</td>
		</tr>
		<tr>
			<td>ingress.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>The name of the kubernetes secret which contains a TLS private key and certificate. Hint: This secret is not created by this chart and must be provided.</td>
		</tr>
		<tr>
			<td>lifecycleHooks</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Lifecycle to automate configuration before or after startup.</td>
		</tr>
		<tr>
			<td>livenessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td>Number of failed executions until container is terminated.</td>
		</tr>
		<tr>
			<td>livenessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td>Delay after container start until LivenessProbe is executed.</td>
		</tr>
		<tr>
			<td>livenessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
20
</pre>
</td>
			<td>Time between probe executions.</td>
		</tr>
		<tr>
			<td>livenessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td>Number of successful executions after failed ones until container is marked healthy.</td>
		</tr>
		<tr>
			<td>livenessProbe.tcpSocket.port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td>The port to connect to the container.</td>
		</tr>
		<tr>
			<td>livenessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td>Timeout for command return.</td>
		</tr>
		<tr>
			<td>nameOverride</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>String to partially override release name.</td>
		</tr>
		<tr>
			<td>nodeSelector</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Node labels for pod assignment. Ref: https://kubernetes.io/docs/user-guide/node-selection/</td>
		</tr>
		<tr>
			<td>persistence.accessModes</td>
			<td>list</td>
			<td><pre lang="json">
[
  "ReadWriteOnce"
]
</pre>
</td>
			<td>The volume access modes, some of "ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany", "ReadWriteOncePod".  "ReadWriteOnce" => The volume can be mounted as read-write by a single node. ReadWriteOnce access mode still can                    allow multiple pods to access the volume when the pods are running on the same node. "ReadOnlyMany" => The volume can be mounted as read-only by many nodes. "ReadWriteMany" => The volume can be mounted as read-write by many nodes. "ReadWriteOncePod" => The volume can be mounted as read-write by a single Pod. Use ReadWriteOncePod access mode if                       you want to ensure that only one pod across whole cluster can read that PVC or write to it. </td>
		</tr>
		<tr>
			<td>persistence.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Annotations for the PVC.</td>
		</tr>
		<tr>
			<td>persistence.dataSource</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Custom PVC data source.</td>
		</tr>
		<tr>
			<td>persistence.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable data persistence (true) or use temporary storage (false).</td>
		</tr>
		<tr>
			<td>persistence.existingClaim</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Use an already existing claim.</td>
		</tr>
		<tr>
			<td>persistence.labels</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Labels for the PVC.</td>
		</tr>
		<tr>
			<td>persistence.selector</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Selector to match an existing Persistent Volume (this value is evaluated as a template).  selector:   matchLabels:     app: my-app </td>
		</tr>
		<tr>
			<td>persistence.size</td>
			<td>string</td>
			<td><pre lang="json">
"10Gi"
</pre>
</td>
			<td>The volume size with unit.</td>
		</tr>
		<tr>
			<td>persistence.storageClass</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>The (storage) class of PV.</td>
		</tr>
		<tr>
			<td>podAnnotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Pod Annotations. Ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations/</td>
		</tr>
		<tr>
			<td>podLabels</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Pod Labels. Ref: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/</td>
		</tr>
		<tr>
			<td>podSecurityContext.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Enable security context.</td>
		</tr>
		<tr>
			<td>podSecurityContext.fsGroup</td>
			<td>int</td>
			<td><pre lang="json">
1000
</pre>
</td>
			<td>If specified, all processes of the container are also part of the supplementary group.</td>
		</tr>
		<tr>
			<td>podSecurityContext.fsGroupChangePolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Always"
</pre>
</td>
			<td>Change ownership and permission of the volume before being exposed inside a Pod.</td>
		</tr>
		<tr>
			<td>podSecurityContext.sysctls</td>
			<td>list</td>
			<td><pre lang="json">
[
  {
    "name": "net.ipv4.ip_unprivileged_port_start",
    "value": "1"
  }
]
</pre>
</td>
			<td>Configure sysctls for the pod</td>
		</tr>
		<tr>
			<td>portalFrontend</td>
			<td>object</td>
			<td><pre lang="json">
{
  "branding": {
    "appleTouchIcon": "",
    "backgroundImage": "",
    "css": "",
    "favicon": "",
    "favicon96Png": "",
    "faviconSvg": "",
    "logo": "",
    "webManifestIcon192": "",
    "webManifestIcon512": ""
  },
  "environment": "production",
  "logLevel": "INFO",
  "nginx": {
    "disableIPv6": false
  }
}
</pre>
</td>
			<td>Application configuration of the Portal Frontend</td>
		</tr>
		<tr>
			<td>portalFrontend.branding</td>
			<td>object</td>
			<td><pre lang="json">
{
  "appleTouchIcon": "",
  "backgroundImage": "",
  "css": "",
  "favicon": "",
  "favicon96Png": "",
  "faviconSvg": "",
  "logo": "",
  "webManifestIcon192": "",
  "webManifestIcon512": ""
}
</pre>
</td>
			<td>Customizations for the portal frontend, such as `custom.css`, `favicon.ico`, `logo.svg`, and `portal_background_image.svg`. For further customizations, please mount a ConfigMap with the respective files.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.appleTouchIcon</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Apple Touch Icon as base 64 encoded string. Must be a PNG image.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.backgroundImage</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Background image for the portal frontend.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.css</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Custom CSS style sheet for the portal frontend.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.favicon</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Favicon for the portal frontend as base 64 encoded string. Must be an ICO file.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.favicon96Png</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Favicon as a 92x92 pixel image in PNG format as a base 64 encoded string.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.faviconSvg</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>SVG version of the favicon as base 64 encoded string. Must be a SVG image.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.logo</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Logo for the loading screen of the portal frontend.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.webManifestIcon192</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Web Manifest icon as a 192x192 pixel PNG file. Must be a base 64 encoded string.</td>
		</tr>
		<tr>
			<td>portalFrontend.branding.webManifestIcon512</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Web Manifest icon as a 512x512 pixel PNG file. Must be a base 64 encoded string.</td>
		</tr>
		<tr>
			<td>portalFrontend.environment</td>
			<td>string</td>
			<td><pre lang="json">
"production"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalFrontend.logLevel</td>
			<td>string</td>
			<td><pre lang="json">
"INFO"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalFrontend.nginx</td>
			<td>object</td>
			<td><pre lang="json">
{
  "disableIPv6": false
}
</pre>
</td>
			<td>Configuration for the Nginx server serving the portal frontend built files.</td>
		</tr>
		<tr>
			<td>portalFrontend.nginx.disableIPv6</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Disable IPv6 support.</td>
		</tr>
		<tr>
			<td>readinessProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td>Number of failed executions until container is terminated.</td>
		</tr>
		<tr>
			<td>readinessProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td>Delay after container start until LivenessProbe is executed.</td>
		</tr>
		<tr>
			<td>readinessProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
20
</pre>
</td>
			<td>Time between probe executions.</td>
		</tr>
		<tr>
			<td>readinessProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td>Number of successful executions after failed ones until container is marked healthy.</td>
		</tr>
		<tr>
			<td>readinessProbe.tcpSocket.port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>readinessProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td>Timeout for command return.</td>
		</tr>
		<tr>
			<td>replicaCount</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td>Set the amount of replicas of deployment.</td>
		</tr>
		<tr>
			<td>resources</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Additional custom annotations.</td>
		</tr>
		<tr>
			<td>service.ports.http.containerPort</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td>Internal port.</td>
		</tr>
		<tr>
			<td>service.ports.http.port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td>Accessible port.</td>
		</tr>
		<tr>
			<td>service.ports.http.protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td>service protocol.</td>
		</tr>
		<tr>
			<td>service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td>Choose the kind of Service, one of "ClusterIP", "NodePort" or "LoadBalancer".</td>
		</tr>
		<tr>
			<td>serviceAccount.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>serviceAccount.automountServiceAccountToken</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>serviceAccount.create</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>serviceAccount.labels</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Additional custom labels for the ServiceAccount.</td>
		</tr>
		<tr>
			<td>serviceAccount.name</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>startupProbe.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
10
</pre>
</td>
			<td>Number of failed executions until container is terminated.</td>
		</tr>
		<tr>
			<td>startupProbe.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td>Delay after container start until StartupProbe is executed.</td>
		</tr>
		<tr>
			<td>startupProbe.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
20
</pre>
</td>
			<td>Time between probe executions.</td>
		</tr>
		<tr>
			<td>startupProbe.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td>Number of successful executions after failed ones until container is marked healthy.</td>
		</tr>
		<tr>
			<td>startupProbe.tcpSocket.port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td>The port to connect to the container.</td>
		</tr>
		<tr>
			<td>startupProbe.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
5
</pre>
</td>
			<td>Timeout for command return.</td>
		</tr>
		<tr>
			<td>terminationGracePeriodSeconds</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>In seconds, time the given to the pod needs to terminate gracefully. Ref: https://kubernetes.io/docs/concepts/workloads/pods/pod/#termination-of-pods</td>
		</tr>
		<tr>
			<td>tolerations</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Tolerations for pod assignment. Ref: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/</td>
		</tr>
		<tr>
			<td>topologySpreadConstraints</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Topology spread constraints rely on node labels to identify the topology domain(s) that each Node is in. Ref: https://kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/  topologySpreadConstraints:   - maxSkew: 1     topologyKey: failure-domain.beta.kubernetes.io/zone     whenUnsatisfiable: DoNotSchedule</td>
		</tr>
		<tr>
			<td>udm</td>
			<td>object</td>
			<td><pre lang="json">
{
  "auth": {
    "existingSecret": {
      "keyMapping": {
        "password": null
      },
      "name": null
    },
    "password": null,
    "username": "svc-portal-server"
  },
  "connection": {
    "url": null
  }
}
</pre>
</td>
			<td>Configuration of the UDM Rest API access</td>
		</tr>
		<tr>
			<td>udm.auth.existingSecret.keyMapping.password</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The key to retrieve the password from. Setting this value allows to use a key with a different name.</td>
		</tr>
		<tr>
			<td>udm.auth.existingSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The name of an existing Secret to use for retrieving the password to use with the UDM Rest API.  "udm.auth.password" will be ignored if this value is set.</td>
		</tr>
		<tr>
			<td>udm.auth.password</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The password used to authenticate with the UDM Rest API. Either this value or an existing Secret has to be specified.</td>
		</tr>
		<tr>
			<td>udm.auth.username</td>
			<td>string</td>
			<td><pre lang="json">
"svc-portal-server"
</pre>
</td>
			<td>The username to authenticate with the UDM Rest API.</td>
		</tr>
		<tr>
			<td>udm.connection.url</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The URL of the UDM Rest API.  Will use "global.udm.connection.url" as a default if this value is not specified.  Example: "http://udm-rest-api:9979/udm"</td>
		</tr>
		<tr>
			<td>updateStrategy.type</td>
			<td>string</td>
			<td><pre lang="json">
"RollingUpdate"
</pre>
</td>
			<td>Set to Recreate if you use persistent volume that cannot be mounted by more than one pods to make sure the pods are destroyed first.</td>
		</tr>
	</tbody>
</table>

