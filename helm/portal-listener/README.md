# portal-listener

A Helm chart for the Univention Portal Listener

- **Version**: 0.1.0
- **Type**: application
- **AppVersion**: 1.16.0
- **Homepage:** <https://www.univention.de/>

## TL;DR

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-listener univention-portal/portal-listener
```

## Introduction

This chart does install the Portal Listener of the Univention Portal.

The listener is a stateful component which does process change events regarding
the central LDAP directory.

## Installing

To install the chart with the release name `portal-listener`:

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-listener univention-portal/portal-listener
```

## Uninstalling

To uninstall the chart with the release name `portal-listener`:

```console
helm uninstall portal-listener
```

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| oci://gitregistry.knut.univention.de/univention/customers/dataport/upx/common-helm/helm | common | ^0.2.0 |
| oci://gitregistry.knut.univention.de/univention/customers/dataport/upx/container-store-dav/helm | store-dav | ^0.2.0 |

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
			<td>autoscaling.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
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
"gitregistry.knut.univention.de"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"univention/components/univention-portal/portal-listener"
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
			<td>image.waitForDependency.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"Always"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.waitForDependency.registry</td>
			<td>string</td>
			<td><pre lang="json">
"gitregistry.knut.univention.de"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.waitForDependency.repository</td>
			<td>string</td>
			<td><pre lang="json">
"univention/components/univention-portal/wait-for-dependency"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.waitForDependency.tag</td>
			<td>string</td>
			<td><pre lang="json">
"latest"
</pre>
</td>
			<td></td>
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
			<td>persistence.data.size</td>
			<td>string</td>
			<td><pre lang="json">
"1Gi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>persistence.data.storageClass</td>
			<td>string</td>
			<td><pre lang="json">
""
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
			<td>portalListener</td>
			<td>object</td>
			<td><pre lang="json">
{
  "adminGroup": null,
  "assetsRoot": "http://portal-server:univention@portal-listener-store-dav/portal-assets/",
  "authMode": "ucs",
  "caCert": "",
  "caCertFile": "/run/secrets/ca_cert",
  "certPem": "",
  "debugLevel": "4",
  "domainName": "univention.intranet",
  "editable": "true",
  "environment": "production",
  "ldapBaseDn": null,
  "ldapHost": null,
  "ldapHostDn": null,
  "ldapHostIp": null,
  "ldapPort": "389",
  "ldapSecret": null,
  "ldapSecretFile": "/var/secrets/ldap_secret",
  "logLevel": "WARNING",
  "machineSecret": null,
  "machineSecretFile": "/var/secrets/machine_secret",
  "notifierServer": null,
  "port": "80",
  "portalDefaultDn": null,
  "tlsMode": "secure",
  "ucsInternalUrl": "http://portal-listener:univention@portal-listener-store-dav/portal-data/",
  "udmApiSecretFile": "/var/secrets/machine_secret",
  "udmApiUrl": null,
  "udmApiUsername": null,
  "umcGetUrl": null,
  "umcSessionUrl": null
}
</pre>
</td>
			<td>Application configuration of the Portal Listener</td>
		</tr>
		<tr>
			<td>portalListener.adminGroup</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define LDAP Admin Group. Example: `"cn=Domain Admins,cn=groups,dc=example,dc=com"`</td>
		</tr>
		<tr>
			<td>portalListener.assetsRoot</td>
			<td>string</td>
			<td><pre lang="json">
"http://portal-server:univention@portal-listener-store-dav/portal-assets/"
</pre>
</td>
			<td>Where to store the assets, e.g. portal entry icons</td>
		</tr>
		<tr>
			<td>portalListener.authMode</td>
			<td>string</td>
			<td><pre lang="json">
"ucs"
</pre>
</td>
			<td>Define the authentication mode for the portal. Use "ucs" or "saml".</td>
		</tr>
		<tr>
			<td>portalListener.caCert</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>CA root certificate, base64-encoded. Optional; will be written to "caCertFile" if set.</td>
		</tr>
		<tr>
			<td>portalListener.caCertFile</td>
			<td>string</td>
			<td><pre lang="json">
"/run/secrets/ca_cert"
</pre>
</td>
			<td>The path to the "caCertFile" docker secret or a plain file.</td>
		</tr>
		<tr>
			<td>portalListener.debugLevel</td>
			<td>string</td>
			<td><pre lang="json">
"4"
</pre>
</td>
			<td>Debug level of the listener</td>
		</tr>
		<tr>
			<td>portalListener.domainName</td>
			<td>string</td>
			<td><pre lang="json">
"univention.intranet"
</pre>
</td>
			<td>Internal domain name of the UCS machine</td>
		</tr>
		<tr>
			<td>portalListener.editable</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td>Defines if members of the Admin group can use the edit mode in the portal.</td>
		</tr>
		<tr>
			<td>portalListener.environment</td>
			<td>string</td>
			<td><pre lang="json">
"production"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalListener.ldapBaseDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Base DN of the LDAP directory</td>
		</tr>
		<tr>
			<td>portalListener.ldapHost</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname of the LDAP server</td>
		</tr>
		<tr>
			<td>portalListener.ldapHostDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the UCS machine</td>
		</tr>
		<tr>
			<td>portalListener.ldapHostIp</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The IP address of the LDAP server.</td>
		</tr>
		<tr>
			<td>portalListener.ldapPort</td>
			<td>string</td>
			<td><pre lang="json">
"389"
</pre>
</td>
			<td>Port to connect to the LDAP server.</td>
		</tr>
		<tr>
			<td>portalListener.ldapSecret</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>LDAP password for `cn=admin`. Will be written to "ldapSecretFile" if set.</td>
		</tr>
		<tr>
			<td>portalListener.ldapSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/ldap_secret"
</pre>
</td>
			<td>The path to the "ldapSecretFile" docker secret or a plain file</td>
		</tr>
		<tr>
			<td>portalListener.logLevel</td>
			<td>string</td>
			<td><pre lang="json">
"WARNING"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalListener.machineSecret</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>LDAP password for `ldapHostDn`. Will be written to "machineSecretFile" if set.</td>
		</tr>
		<tr>
			<td>portalListener.machineSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/machine_secret"
</pre>
</td>
			<td>The path to the "machineSecretFile" docker secret or a plain file</td>
		</tr>
		<tr>
			<td>portalListener.notifierServer</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname where the notifier can be reached.</td>
		</tr>
		<tr>
			<td>portalListener.portalDefaultDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the default portal</td>
		</tr>
		<tr>
			<td>portalListener.tlsMode</td>
			<td>string</td>
			<td><pre lang="json">
"secure"
</pre>
</td>
			<td>Whenever to start encryption and validate certificates. Chose from "off", "unvalidated" and "secure".</td>
		</tr>
		<tr>
			<td>portalListener.ucsInternalUrl</td>
			<td>string</td>
			<td><pre lang="json">
"http://portal-listener:univention@portal-listener-store-dav/portal-data/"
</pre>
</td>
			<td>Define UCS internal endpoint. Example: `"https://portal.example.com/univention/internal"`</td>
		</tr>
		<tr>
			<td>portalListener.udmApiSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/machine_secret"
</pre>
</td>
			<td>UDM API password file.    Default: same as `machineSecretFile`.</td>
		</tr>
		<tr>
			<td>portalListener.udmApiUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>UDM API connection URL</td>
		</tr>
		<tr>
			<td>portalListener.udmApiUsername</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>UDM API username.</td>
		</tr>
		<tr>
			<td>portalListener.umcGetUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define UMC get endpoint. Example: `"https://portal.example.com/univention/internal/umc/get"`</td>
		</tr>
		<tr>
			<td>portalListener.umcSessionUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define UMC session-info" endpoint. Example: `"https://portal.example.com/univention/internal/umc/get/session-info"`</td>
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
			<td>resources</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Deployment resources for the listener container</td>
		</tr>
		<tr>
			<td>resourcesWaitForDependency</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Deployment resources for the dependency waiters</td>
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
			<td>storeDav.bundled</td>
			<td>bool</td>
			<td><pre lang="json">
true
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

