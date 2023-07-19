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
| oci://gitregistry.knut.univention.de/univention/customers/dataport/upx/common-helm/helm | common | ^0.1.0 |
| oci://gitregistry.knut.univention.de/univention/customers/dataport/upx/container-store-dav/helm | store-dav | ^0.1.0 |

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
"registry.souvap-univention.de"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"souvap/tooling/images/univention-portal/portal-listener"
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
			<td>portal_listener</td>
			<td>object</td>
			<td><pre lang="json">
{
  "admin_group": null,
  "assets_root": "http://portal-server:univention@portal-listener-store-dav/portal-assets/",
  "auth_mode": "ucs",
  "ca_cert_file": "/var/secrets/ca_cert",
  "cert_pem_file": "/var/secrets/cert_pem",
  "debug_level": "5",
  "domain_name": "univention.intranet",
  "editable": "true",
  "environment": "production",
  "ldapStartTls": "never",
  "ldapTlsReqcert": "demand",
  "ldap_base_dn": null,
  "ldap_bind_secret": "/var/secrets/ldap_secret",
  "ldap_host": null,
  "ldap_host_dn": null,
  "ldap_host_ip": null,
  "ldap_port": "389",
  "log_level": "WARNING",
  "machine_secret_file": "/var/secrets/machine_secret",
  "notifier_server": null,
  "portal_default_dn": null,
  "ucs_internal_url": "http://portal-listener:univention@portal-listener-store-dav/portal-data/",
  "udm_api_password_secret": "/var/secrets/machine_secret",
  "udm_api_url": null,
  "udm_api_username": null,
  "umc_get_url": null,
  "umc_session_url": null
}
</pre>
</td>
			<td>Application configuration of the Portal Listener</td>
		</tr>
		<tr>
			<td>portal_listener.admin_group</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define LDAP Admin Group. Example: `"cn=Domain Admins,cn=groups,dc=example,dc=com"`</td>
		</tr>
		<tr>
			<td>portal_listener.assets_root</td>
			<td>string</td>
			<td><pre lang="json">
"http://portal-server:univention@portal-listener-store-dav/portal-assets/"
</pre>
</td>
			<td>Where to store the assets, e.g. portal entry icons</td>
		</tr>
		<tr>
			<td>portal_listener.auth_mode</td>
			<td>string</td>
			<td><pre lang="json">
"ucs"
</pre>
</td>
			<td>Define the authentication mode for the portal. Use "ucs" or "saml".</td>
		</tr>
		<tr>
			<td>portal_listener.ca_cert_file</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/ca_cert"
</pre>
</td>
			<td>Path to the CA certificate of the UCS machine.</td>
		</tr>
		<tr>
			<td>portal_listener.cert_pem_file</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/cert_pem"
</pre>
</td>
			<td>Path to the certificate of the LDAP server</td>
		</tr>
		<tr>
			<td>portal_listener.debug_level</td>
			<td>string</td>
			<td><pre lang="json">
"5"
</pre>
</td>
			<td>Debug level of the listener</td>
		</tr>
		<tr>
			<td>portal_listener.domain_name</td>
			<td>string</td>
			<td><pre lang="json">
"univention.intranet"
</pre>
</td>
			<td>Internal domain name of the UCS machine</td>
		</tr>
		<tr>
			<td>portal_listener.editable</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td>Defines if members of the Admin group can use the edit mode in the portal.</td>
		</tr>
		<tr>
			<td>portal_listener.environment</td>
			<td>string</td>
			<td><pre lang="json">
"production"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portal_listener.ldapStartTls</td>
			<td>string</td>
			<td><pre lang="json">
"never"
</pre>
</td>
			<td>Configure if the LDAP client shall start TLS when connecting. Chose from "never", "request" and "require".</td>
		</tr>
		<tr>
			<td>portal_listener.ldapTlsReqcert</td>
			<td>string</td>
			<td><pre lang="json">
"demand"
</pre>
</td>
			<td>Allows to set the parameter "TLS_REQCERT" in the ldap client configuration.  The man page of "ldap.conf" does provide details about the allowed values and how this influences the client behavior.  See: https://www.openldap.org/software//man.cgi?query=ldap.conf</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_base_dn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Base DN of the LDAP directory</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_bind_secret</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/ldap_secret"
</pre>
</td>
			<td>Path to secret file for the bind to the LDAP directory</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname of the LDAP server</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_host_dn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the UCS machine</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_host_ip</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The IP address of the LDAP server.</td>
		</tr>
		<tr>
			<td>portal_listener.ldap_port</td>
			<td>string</td>
			<td><pre lang="json">
"389"
</pre>
</td>
			<td>Port to connect to the LDAP server.</td>
		</tr>
		<tr>
			<td>portal_listener.log_level</td>
			<td>string</td>
			<td><pre lang="json">
"WARNING"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portal_listener.machine_secret_file</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/machine_secret"
</pre>
</td>
			<td>Path to the file which the machine secret</td>
		</tr>
		<tr>
			<td>portal_listener.notifier_server</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname where the notifier can be reached.</td>
		</tr>
		<tr>
			<td>portal_listener.portal_default_dn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the default portal</td>
		</tr>
		<tr>
			<td>portal_listener.ucs_internal_url</td>
			<td>string</td>
			<td><pre lang="json">
"http://portal-listener:univention@portal-listener-store-dav/portal-data/"
</pre>
</td>
			<td>Define UCS internal endpoint. Example: `"https://portal.example.com/univention/internal"`</td>
		</tr>
		<tr>
			<td>portal_listener.udm_api_url</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>UDM API connection URL</td>
		</tr>
		<tr>
			<td>portal_listener.umc_get_url</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define UMC get endpoint. Example: `"https://portal.example.com/univention/internal/umc/get"`</td>
		</tr>
		<tr>
			<td>portal_listener.umc_session_url</td>
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
			<td>string</td>
			<td><pre lang="json">
null
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
			<td>serviceAccount.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
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
			<td>serviceAccount.name</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>store-dav.bundled</td>
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

