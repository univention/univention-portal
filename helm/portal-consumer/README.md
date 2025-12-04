# portal-consumer

A Helm chart for the Univention Portal Consumer

- **Version**: 0.1.0
- **Type**: application
- **AppVersion**: 1.16.0
- **Homepage:** <https://www.univention.de/>

## TL;DR

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-consumer univention-portal/portal-consumer
```

## Introduction

This chart does install the Portal Consumer of the Univention Portal.

The consumer is a stateful component which does process change events regarding
the central LDAP directory.

## Installing

To install the chart with the release name `portal-consumer`:

```console
helm repo add univention-portal https://gitlab.souvap-univention.de/api/v4/projects/75/packages/helm/stable
helm upgrade --install portal-consumer univention-portal/portal-consumer
```

## Uninstalling

To uninstall the chart with the release name `portal-consumer`:

```console
helm uninstall portal-consumer
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
1001
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
1001
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
			<td>environment</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>extraEnvVars</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Array with extra environment variables to add to containers</td>
		</tr>
		<tr>
			<td>extraSecrets</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td></td>
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
			<td>global.ldap.connection.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.ldap.connection.port</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>global.nubusDeployment</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Indicates wether this chart is part of a Nubus deployment.</td>
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
			<td>initResources</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Deployment resources for the init containers</td>
		</tr>
		<tr>
			<td>ldap.auth.bindDn</td>
			<td>string</td>
			<td><pre lang="json">
"cn=admin,{{ include \"portal-consumer.ldapBaseDn\" . }}"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.auth.existingSecret.keyMapping.password</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.auth.existingSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.auth.password</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.connection.host</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.connection.port</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tls.enabled</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tls.existingSecret.keyMapping."ca.crt"</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tls.existingSecret.keyMapping."tls.crt"</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tls.existingSecret.keyMapping."tls.key"</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tls.existingSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
null
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
			<td>objectStorage.auth.accessKeyId</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>User for the object storage. Secret will be created if existingSecret is not set.</td>
		</tr>
		<tr>
			<td>objectStorage.auth.existingSecret.keyMapping.access_key_id</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>objectStorage.auth.existingSecret.keyMapping.secret_access_key</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>objectStorage.auth.existingSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The name of an existing Secret to use for retrieving the secret to use as object storage secret access key.  "objectStorage.auth.accessKeyId" and "objectStorage.auth.secretAccessKey" will be ignored if this value is set.</td>
		</tr>
		<tr>
			<td>objectStorage.auth.secretAccessKey</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Password for access to object storage. Secret will be created if existingSecret is not set.</td>
		</tr>
		<tr>
			<td>objectStorage.bucketName</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Bucket in the object storage for storing the portal and assets. Example "portal-data".</td>
		</tr>
		<tr>
			<td>objectStorage.endpoint</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Object storage endpoint, e.g. "http://minio:9000".</td>
		</tr>
		<tr>
			<td>persistence.groupMembershipCache.size</td>
			<td>string</td>
			<td><pre lang="json">
"100Mi"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>persistence.groupMembershipCache.storageClass</td>
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
1001
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
			<td>Allow binding to ports below 1024 without root access.</td>
		</tr>
		<tr>
			<td>portalConsumer</td>
			<td>object</td>
			<td><pre lang="json">
{
  "adminGroup": null,
  "assetsBaseUrl": null,
  "assetsRootPath": "portal-assets",
  "authMode": "",
  "caCert": "",
  "caCertFile": "/var/secrets/ca_cert",
  "certPem": "",
  "domainName": "univention.intranet",
  "editable": "true",
  "environment": "production",
  "image": {
    "pullPolicy": "",
    "registry": "",
    "repository": "nubus-dev/images/portal-consumer",
    "tag": "latest"
  },
  "logLevel": "INFO",
  "port": "80",
  "portalDefaultDn": null,
  "tlsMode": "off",
  "ucsInternalPath": "portal-data",
  "umcGetUrl": "{{- printf \"http://%s-umc-server/get/session-info\" .Release.Name -}}",
  "umcSessionUrl": "{{- printf \"http://%s-umc-server/get/session-info\" .Release.Name -}}"
}
</pre>
</td>
			<td>Application configuration of the Portal Consumer</td>
		</tr>
		<tr>
			<td>portalConsumer.adminGroup</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define LDAP Admin Group. Example: `"cn=Domain Admins,cn=groups,dc=example,dc=com"`</td>
		</tr>
		<tr>
			<td>portalConsumer.assetsBaseUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Base URL to use when generating URLs of the portal assets (icons, logos). This has to be configured if an S3 compatible storage is used which is reachable via a separate domain.</td>
		</tr>
		<tr>
			<td>portalConsumer.assetsRootPath</td>
			<td>string</td>
			<td><pre lang="json">
"portal-assets"
</pre>
</td>
			<td>Where to store the assets inside the object storage bucket, e.g. portal entry icons</td>
		</tr>
		<tr>
			<td>portalConsumer.authMode</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Define the authentication mode for the portal. Use "ucs" or "saml". Chart default is "ucs". In a Nubus deployment the default is "saml".</td>
		</tr>
		<tr>
			<td>portalConsumer.caCert</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>CA root certificate, base64-encoded. Optional; will be written to "caCertFile" if set.</td>
		</tr>
		<tr>
			<td>portalConsumer.caCertFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/ca_cert"
</pre>
</td>
			<td>The path to the "caCertFile" docker secret or a plain file.</td>
		</tr>
		<tr>
			<td>portalConsumer.domainName</td>
			<td>string</td>
			<td><pre lang="json">
"univention.intranet"
</pre>
</td>
			<td>Internal domain name of the UCS machine</td>
		</tr>
		<tr>
			<td>portalConsumer.editable</td>
			<td>string</td>
			<td><pre lang="json">
"true"
</pre>
</td>
			<td>Defines if members of the Admin group can use the edit mode in the portal.</td>
		</tr>
		<tr>
			<td>portalConsumer.environment</td>
			<td>string</td>
			<td><pre lang="json">
"production"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalConsumer.portalDefaultDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the default portal</td>
		</tr>
		<tr>
			<td>portalConsumer.tlsMode</td>
			<td>string</td>
			<td><pre lang="json">
"off"
</pre>
</td>
			<td>Whenever to start encryption and validate certificates. Chose from "off", "unvalidated" and "secure". Chart default is "off".</td>
		</tr>
		<tr>
			<td>portalConsumer.ucsInternalPath</td>
			<td>string</td>
			<td><pre lang="json">
"portal-data"
</pre>
</td>
			<td>Define UCS internal endpoint where the portal, selfservice and groups are defined Example: `"https://portal.example.com/univention/internal"`</td>
		</tr>
		<tr>
			<td>portalConsumer.umcGetUrl</td>
			<td>string</td>
			<td><pre lang="json">
"{{- printf \"http://%s-umc-server/get/session-info\" .Release.Name -}}"
</pre>
</td>
			<td>Define UMC get endpoint. Example: `"https://portal.example.com/univention/internal/umc/get"`</td>
		</tr>
		<tr>
			<td>portalConsumer.umcSessionUrl</td>
			<td>string</td>
			<td><pre lang="json">
"{{- printf \"http://%s-umc-server/get/session-info\" .Release.Name -}}"
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
			<td>probes.liveness.exec.command[0]</td>
			<td>string</td>
			<td><pre lang="json">
"sh"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.exec.command[1]</td>
			<td>string</td>
			<td><pre lang="json">
"-c"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.liveness.exec.command[2]</td>
			<td>string</td>
			<td><pre lang="json">
"exit 0\n"
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
			<td>probes.readiness.exec.command[0]</td>
			<td>string</td>
			<td><pre lang="json">
"sh"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.exec.command[1]</td>
			<td>string</td>
			<td><pre lang="json">
"-c"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>probes.readiness.exec.command[2]</td>
			<td>string</td>
			<td><pre lang="json">
"exit 0\n"
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
			<td>provisioningApi.auth</td>
			<td>object</td>
			<td><pre lang="json">
{
  "existingSecret": {
    "keyMapping": {
      "password": null
    },
    "name": null
  },
  "password": "",
  "username": "portal-consumer"
}
</pre>
</td>
			<td>Authentication parameters</td>
		</tr>
		<tr>
			<td>provisioningApi.auth.existingSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The name of the secret containing the password. "provisioningApi.auth.password" and "provisioningApi.auth.username" will be ignored if this value is set.</td>
		</tr>
		<tr>
			<td>provisioningApi.auth.password</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>The password to authenticate with. A secret will be created if existingSecret is not set.</td>
		</tr>
		<tr>
			<td>provisioningApi.auth.username</td>
			<td>string</td>
			<td><pre lang="json">
"portal-consumer"
</pre>
</td>
			<td>The username to authenticate with. A secret will be created if existingSecret is not set.</td>
		</tr>
		<tr>
			<td>provisioningApi.config.maxAcknowledgementRetries</td>
			<td>int</td>
			<td><pre lang="json">
3
</pre>
</td>
			<td>The maximum number of retries for acknowledging a message</td>
		</tr>
		<tr>
			<td>provisioningApi.connection</td>
			<td>object</td>
			<td><pre lang="json">
{
  "url": ""
}
</pre>
</td>
			<td>Connection parameters</td>
		</tr>
		<tr>
			<td>provisioningApi.connection.url</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>The base URL the provisioning API is reachable at. (e.g. "https://provisioning-api")</td>
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
			<td>Deployment resources for the consumer container</td>
		</tr>
		<tr>
			<td>serviceAccount.annotations</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td>Annotations to add to the service account</td>
		</tr>
		<tr>
			<td>serviceAccount.automountServiceAccountToken</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Allows auto mount of ServiceAccountToken on the serviceAccount created Can be set to false if pods using this serviceAccount do not need to use K8s API </td>
		</tr>
		<tr>
			<td>serviceAccount.create</td>
			<td>bool</td>
			<td><pre lang="json">
true
</pre>
</td>
			<td>Specifies whether a service account should be created</td>
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
			<td>The name of the service account to use. If not set and create is true, a name is generated using the fullname template</td>
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
			<td></td>
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
    "username": "cn=admin"
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
"cn=admin"
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
			<td>waitForDependency.extraEnvVars</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Array with extra environment variables to add to containers.</td>
		</tr>
		<tr>
			<td>waitForDependency.extraVolumeMounts</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Optionally specify an extra list of additional volumeMounts.</td>
		</tr>
		<tr>
			<td>waitForDependency.extraVolumes</td>
			<td>list</td>
			<td><pre lang="json">
[]
</pre>
</td>
			<td>Optionally specify an extra list of additional volumes.</td>
		</tr>
		<tr>
			<td>waitForDependency.image.pullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>waitForDependency.image.registry</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>waitForDependency.image.repository</td>
			<td>string</td>
			<td><pre lang="json">
"nubus/images/wait-for-dependency"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>waitForDependency.image.tag</td>
			<td>string</td>
			<td><pre lang="json">
"0.35.33@sha256:0570b6e8f57d27fe3c856d53c324b2e0457ad83ead442d54a3af806ea0f6a626"
</pre>
</td>
			<td></td>
		</tr>
	</tbody>
</table>

