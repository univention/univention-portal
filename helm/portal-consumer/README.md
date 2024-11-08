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
| oci://registry-1.docker.io/bitnamicharts | common | ^2.x.x |

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
			<td>global.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"IfNotPresent"
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
			<td>global.nubusDeployment</td>
			<td>bool</td>
			<td><pre lang="json">
false
</pre>
</td>
			<td>Indicates wether this chart is part of a Nubus deployment.</td>
		</tr>
		<tr>
			<td>ldap.credentialSecret.ldapPasswordKey</td>
			<td>string</td>
			<td><pre lang="json">
"ldap.secret"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.credentialSecret.machinePasswordKey</td>
			<td>string</td>
			<td><pre lang="json">
"machine.secret"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.credentialSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tlsSecret.caCertKey</td>
			<td>string</td>
			<td><pre lang="json">
"ca.crt"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tlsSecret.certificateKey</td>
			<td>string</td>
			<td><pre lang="json">
"tls.crt"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tlsSecret.name</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>ldap.tlsSecret.privateKeyKey</td>
			<td>string</td>
			<td><pre lang="json">
"tls.key"
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>mountSecrets</td>
			<td>bool</td>
			<td><pre lang="json">
true
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
			<td>podSecurityContext</td>
			<td>object</td>
			<td><pre lang="json">
{}
</pre>
</td>
			<td></td>
		</tr>
		<tr>
			<td>portalConsumer</td>
			<td>object</td>
			<td><pre lang="json">
{
  "adminGroup": null,
  "assetsRootPath": "portal-assets",
  "authMode": "",
  "caCert": "",
  "caCertFile": "/var/secrets/ca_cert",
  "certPem": "",
  "debugLevel": "1",
  "domainName": "univention.intranet",
  "editable": "true",
  "environment": "production",
  "image": {
    "imagePullPolicy": "IfNotPresent",
    "registry": "",
    "repository": "nubus-dev/images/portal-consumer",
    "tag": "latest"
  },
  "ldapBaseDn": null,
  "ldapHost": null,
  "ldapHostDn": null,
  "ldapHostIp": null,
  "ldapPort": "",
  "ldapSecret": null,
  "ldapSecretFile": "/var/secrets/ldap_secret",
  "logLevel": "INFO",
  "machineSecret": null,
  "machineSecretFile": "/var/secrets/machine_secret",
  "notifierServer": null,
  "objectStorageAccessKeyId": "",
  "objectStorageBucket": "",
  "objectStorageCredentialSecret": {
    "accessKeyKey": "accessKey",
    "name": "",
    "secretKeyKey": "secretKey"
  },
  "objectStorageEndpoint": "",
  "objectStorageSecretAccessKey": "",
  "port": "80",
  "portalDefaultDn": null,
  "provisioningApiBaseUrl": "http://provisioning-api",
  "secretMountPath": "/var/secrets",
  "tlsMode": "off",
  "ucsInternalPath": "portal-data",
  "udmApiSecretFile": "/var/secrets/machine_secret",
  "udmApiUrl": null,
  "udmApiUsername": "cn=admin",
  "umcGetUrl": null,
  "umcSessionUrl": null
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
			<td>portalConsumer.debugLevel</td>
			<td>string</td>
			<td><pre lang="json">
"1"
</pre>
</td>
			<td>Debug level of the consumer</td>
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
			<td>portalConsumer.ldapBaseDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Base DN of the LDAP directory</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapHost</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname of the LDAP server</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapHostDn</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>DN of the UCS machine</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapHostIp</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>The IP address of the LDAP server.</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapPort</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Port to connect to the LDAP server. Chart defaults to 389.</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapSecret</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>LDAP password for `cn=admin`. Will be written to "ldapSecretFile" if set.</td>
		</tr>
		<tr>
			<td>portalConsumer.ldapSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/ldap_secret"
</pre>
</td>
			<td>The path to the "ldapSecretFile" docker secret or a plain file</td>
		</tr>
		<tr>
			<td>portalConsumer.logLevel</td>
			<td>string</td>
			<td><pre lang="json">
"INFO"
</pre>
</td>
			<td>TODO: Clarify usage of this parameter</td>
		</tr>
		<tr>
			<td>portalConsumer.machineSecret</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>LDAP password for `ldapHostDn`. Will be written to "machineSecretFile" if set.</td>
		</tr>
		<tr>
			<td>portalConsumer.machineSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/machine_secret"
</pre>
</td>
			<td>The path to the "machineSecretFile" docker secret or a plain file</td>
		</tr>
		<tr>
			<td>portalConsumer.notifierServer</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Hostname where the notifier can be reached.</td>
		</tr>
		<tr>
			<td>portalConsumer.objectStorageAccessKeyId</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>User for the object storage. Chart default is "ums_user".</td>
		</tr>
		<tr>
			<td>portalConsumer.objectStorageBucket</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Bucket in the object storage for storing the portal and assets. Chart default is "ums". Nubus chart default is "ums".</td>
		</tr>
		<tr>
			<td>portalConsumer.objectStorageCredentialSecret</td>
			<td>object</td>
			<td><pre lang="json">
{
  "accessKeyKey": "accessKey",
  "name": "",
  "secretKeyKey": "secretKey"
}
</pre>
</td>
			<td>Optional reference to a different secret for credentials credentialSecret:   name: "custom-credentials"   accessKeyId: "ums_user"   secretAccessKey: "ums_password"</td>
		</tr>
		<tr>
			<td>portalConsumer.objectStorageEndpoint</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Object storage endpoint. Chart default is "http://ums-minio:9000". Nubus chart default is "http://$RELEASE_NAME.ums-minio:9000".</td>
		</tr>
		<tr>
			<td>portalConsumer.objectStorageSecretAccessKey</td>
			<td>string</td>
			<td><pre lang="json">
""
</pre>
</td>
			<td>Password for access to object storage. Chart default is "stub_password".</td>
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
			<td>portalConsumer.secretMountPath</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets"
</pre>
</td>
			<td>Path to mount the secrets to.</td>
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
			<td>portalConsumer.udmApiSecretFile</td>
			<td>string</td>
			<td><pre lang="json">
"/var/secrets/machine_secret"
</pre>
</td>
			<td>UDM API password file.    Default: same as `machineSecretFile`.</td>
		</tr>
		<tr>
			<td>portalConsumer.udmApiUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>UDM API connection URL</td>
		</tr>
		<tr>
			<td>portalConsumer.udmApiUsername</td>
			<td>string</td>
			<td><pre lang="json">
"cn=admin"
</pre>
</td>
			<td>UDM API username.</td>
		</tr>
		<tr>
			<td>portalConsumer.umcGetUrl</td>
			<td>string</td>
			<td><pre lang="json">
null
</pre>
</td>
			<td>Define UMC get endpoint. Example: `"https://portal.example.com/univention/internal/umc/get"`</td>
		</tr>
		<tr>
			<td>portalConsumer.umcSessionUrl</td>
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
			<td>Deployment resources for the consumer container</td>
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
			<td>waitForDependency.image.imagePullPolicy</td>
			<td>string</td>
			<td><pre lang="json">
"IfNotPresent"
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
"0.25.0@sha256:71a4d66fd67db6f92212b1936862b2b0d5a678d412213d74452a9195c2fe67f7"
</pre>
</td>
			<td></td>
		</tr>
	</tbody>
</table>

