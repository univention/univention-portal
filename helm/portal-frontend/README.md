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
| oci://gitregistry.knut.univention.de/univention/customers/dataport/upx/common-helm/helm | common | ^0.5.0 |

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
			<td>affinity</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>environment</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>extraIngresses.master</td>
			<td>object</td>
			<td><pre lang="json">
{
  "annotations": {
    "nginx.org/mergeable-ingress-type": "master"
  },
  "enabled": false,
  "host": null,
  "ingressClassName": null,
  "tls": {
    "enabled": true,
    "secretName": ""
  }
}
</pre>
</td>
			<td>Needed when using nginx-ingress as ingress controller. Enable by setting the "enabled" attribute to "true". Be aware that you also have to switch off "tls" in all ingress objects of type "minion".  See: https://github.com/nginxinc/kubernetes-ingress/tree/v3.2.1/examples/ingress-resources/mergeable-ingress-types</td>
		</tr>
		<tr>
			<td>extraIngresses.master.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.host".</td>
		</tr>
		<tr>
			<td>extraIngresses.master.ingressClassName</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.ingressClassName".</td>
		</tr>
		<tr>
			<td>extraIngresses.master.tls.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>TLS is configured by default if the "master" ingress is enabled.</td>
		</tr>
		<tr>
			<td>extraIngresses.master.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>By default uses the value of "ingress.tls.secretName"</td>
		</tr>
		<tr>
			<td>extraIngresses.redirects</td>
			<td>object</td>
			<td><pre lang="json">
{
  "annotations": {
    "nginx.ingress.kubernetes.io/configuration-snippet": "absolute_redirect off;\nreturn 302 /univention/portal/;\n",
    "nginx.org/location-snippets": "absolute_redirect off;\nreturn 302 /univention/portal/;\n",
    "nginx.org/mergeable-ingress-type": "minion"
  },
  "enabled": true,
  "host": null,
  "ingressClassName": null,
  "paths": [
    {
      "path": "/",
      "pathType": "Exact"
    },
    {
      "path": "/univention",
      "pathType": "Exact"
    },
    {
      "path": "/univention/",
      "pathType": "Exact"
    },
    {
      "path": "/univention/portal",
      "pathType": "Exact"
    },
    {
      "path": "/univention/selfservice",
      "pathType": "Exact"
    }
  ],
  "tls": {
    "enabled": null,
    "secretName": ""
  }
}
</pre>
</td>
			<td>Redirects "/" and "/univention/" to "/univention/portal/".</td>
		</tr>
		<tr>
			<td>extraIngresses.redirects.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.host".</td>
		</tr>
		<tr>
			<td>extraIngresses.redirects.ingressClassName</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.ingressClassName".</td>
		</tr>
		<tr>
			<td>extraIngresses.redirects.tls.enabled</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.tls.enabled"</td>
		</tr>
		<tr>
			<td>extraIngresses.redirects.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>By default uses the value of "ingress.tls.secretName"</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround</td>
			<td>object</td>
			<td><pre lang="json">
{
  "annotations": {
    "nginx.ingress.kubernetes.io/configuration-snippet": "return 404;\n"
  },
  "enabled": false,
  "host": null,
  "ingressClassName": null,
  "paths": [
    {
      "path": "/",
      "pathType": "Prefix"
    }
  ],
  "tls": {
    "enabled": null,
    "secretName": ""
  }
}
</pre>
</td>
			<td>Workaround for open issues in "ingress-nginx" to ensure 404 responses on paths which are not handled by the ums stack. Mitigates https://github.com/kubernetes/ingress-nginx/issues/9054 .</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>You have to enable this by setting this value to "true".</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.host".</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround.ingressClassName</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>By default uses the value of "ingress.ingressClassName".</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround.tls.enabled</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>TLS is configured by default if the "master" ingress is enabled.</td>
		</tr>
		<tr>
			<td>extraIngresses.workaround.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>By default uses the value of "ingress.tls.secretName"</td>
		</tr>
		<tr>
			<td>extraVolumeMounts</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Allows to configure extra Volume Mounts. The syntax is the same as the "volumeMounts" key in the Container spec.</td>
		</tr>
		<tr>
			<td>extraVolumes</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Allows to configure extra Volumes. The syntax is the same as the "volumes" key in the Pod spec.</td>
		</tr>
		<tr>
			<td>fullnameOverride</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Always"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.registry</td>
			<td>string</td>
			<td><pre lang="json">
"registry.souvap-univention.de"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"souvap/tooling/images/univention-portal/portal-frontend"
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
			<td>ingress.annotations."nginx.ingress.kubernetes.io/configuration-snippet"</td>
			<td>string</td>
			<td><pre lang="json">
"rewrite ^/univention/portal(/.*)$ $1 break;\nrewrite ^/univention/selfservice(/.*)$ $1 break;\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ingress.annotations."nginx.org/location-snippets"</td>
			<td>string</td>
			<td><pre lang="json">
"rewrite ^/univention/portal(/.*)$ $1 break;\nrewrite ^/univention/selfservice(/.*)$ $1 break;\n"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ingress.annotations."nginx.org/mergeable-ingress-type"</td>
			<td>string</td>
			<td><pre lang="json">
"minion"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ingress.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Set this to `true` in order to enable the installation on Ingress related objects.</td>
		</tr>
		<tr>
			<td>ingress.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The hostname. This parameter has to be supplied. Example `portal.example`.</td>
		</tr>
		<tr>
			<td>ingress.ingressClassName</td>
			<td>string</td>
			<td><pre lang="json">
"nginx"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ingress.paths</td>
			<td>list</td>
			<td><pre lang="json">
[
  {
    "path": "/univention/portal/",
    "pathType": "Exact"
  },
  {
    "path": "/univention/selfservice/",
    "pathType": "Exact"
  },
  {
    "path": "/univention/portal/index.html",
    "pathType": "Exact"
  },
  {
    "path": "/univention/portal/css/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/portal/fonts/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/portal/i18n/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/portal/media/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/portal/js/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/portal/oidc/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/css/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/fonts/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/i18n/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/media/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/js/",
    "pathType": "Prefix"
  },
  {
    "path": "/univention/selfservice/oidc/",
    "pathType": "Prefix"
  }
]
</pre>
</td>
			<td>The path configuration. The default only grabs what is known to be part of the frontend.</td>
		</tr>
		<tr>
			<td>ingress.tls.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ingress.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Set this to `true` in order to enable the installation on Istio related objects.</td>
		</tr>
		<tr>
			<td>istio.gateway.annotations</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.externalGatewayName</td>
			<td>string</td>
			<td><pre lang="json">
"swp-istio-gateway"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.selectorIstio</td>
			<td>string</td>
			<td><pre lang="json">
"ingressgateway"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.tls.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.tls.httpsRedirect</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.gateway.tls.secretName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The hostname. This parameter has to be supplied. Example `portal.example`.</td>
		</tr>
		<tr>
			<td>istio.virtualService.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.virtualService.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>istio.virtualService.pathOverrides</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Allows to inject deployment specific path configuration which is configured before the elements from `paths` below. This allows to redirect some paths to other services, e.g. in order to supply a file `custom.css`.</td>
		</tr>
		<tr>
			<td>istio.virtualService.paths</td>
			<td>list</td>
			<td><pre lang="json">
[
  {
    "match": "prefix",
    "path": "/univention/portal/css/",
    "rewrite": "/css/"
  },
  {
    "match": "prefix",
    "path": "/univention/portal/fonts/",
    "rewrite": "/fonts/"
  },
  {
    "match": "prefix",
    "path": "/univention/portal/i18n/",
    "rewrite": "/i18n/"
  },
  {
    "match": "exact",
    "path": "/univention/portal/",
    "rewrite": "/"
  },
  {
    "match": "exact",
    "path": "/univention/portal/index.html",
    "rewrite": "/index.html"
  },
  {
    "match": "prefix",
    "path": "/univention/portal/media/",
    "rewrite": "/media/"
  },
  {
    "match": "prefix",
    "path": "/univention/portal/js/",
    "rewrite": "/js/"
  },
  {
    "match": "prefix",
    "path": "/univention/portal/oidc/",
    "rewrite": "/oidc/"
  },
  {
    "match": "exact",
    "path": "/univention/selfservice/",
    "rewrite": "/"
  }
]
</pre>
</td>
			<td>The paths configuration. The default only grabs what is known to be part of the frontend.  TODO: Istio does currently not support a URL rewrite which uses regular expressions, basically the capture groups are not yet supported. It also does not support an automatic sorting of rules based on the prefix length like the nginx ingress does. Interim we mention explicitly every prefix which is exclusively part of the frontend in this configuration. This way all other subpaths in "/univention/portal/" can still be reliably grabbed by other services if they are present.  `pathOverrides` is provided as a workaround so that specific sub-paths can be redirected to other services.</td>
		</tr>
		<tr>
			<td>nameOverride</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>nodeSelector</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>podAnnotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>podSecurityContext</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>portalFrontend</td>
			<td>object</td>
			<td><pre lang="json">
{
  "environment": "production",
  "logLevel": "WARNING"
}
</pre>
</td>
			<td>Application configuration of the Portal Frontend</td>
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
"WARNING"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>probes.liveness.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
120
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.failureThreshold</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.initialDelaySeconds</td>
			<td>int</td>
			<td><pre lang="json">
30
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.periodSeconds</td>
			<td>int</td>
			<td><pre lang="json">
15
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.successThreshold</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>replicaCount</td>
			<td>int</td>
			<td><pre lang="json">
1
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>resources.limits.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"4"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>resources.limits.memory</td>
			<td>string</td>
			<td><pre lang="json">
"4Gi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>resources.requests.cpu</td>
			<td>string</td>
			<td><pre lang="json">
"250m"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>resources.requests.memory</td>
			<td>string</td>
			<td><pre lang="json">
"512Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>securityContext</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.ports.http.containerPort</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.ports.http.port</td>
			<td>int</td>
			<td><pre lang="json">
80
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.ports.http.protocol</td>
			<td>string</td>
			<td><pre lang="json">
"TCP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.sessionAffinity.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.sessionAffinity.timeoutSeconds</td>
			<td>int</td>
			<td><pre lang="json">
10800
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>service.type</td>
			<td>string</td>
			<td><pre lang="json">
"ClusterIP"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>tolerations</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td></td>
		</tr>
	</tbody>
</table>

