{{- /*
SPDX-FileCopyrightText: 2024 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}
{{- /*
These template definitions relate to the use of this Helm chart as a sub-chart of the Nubus Umbrella Chart.
Templates defined in other Helm sub-charts are imported to be used to configure this chart.
If the value .Values.global.nubusDeployment equates to true, the defined templates are imported.
*/}}
{{- define "portal-consumer.ldapBaseDn" -}}
{{- if .Values.portalConsumer.ldapBaseDn -}}
{{- .Values.portalConsumer.ldapBaseDn -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.baseDn" . -}}
{{- else -}}
dc=univention-organization,dc=intranet
{{- end -}}
{{- end -}}

{{- define "portal-consumer.ldapAdminDn" -}}
{{- if .Values.portalConsumer.ldapHostDn -}}
{{- .Values.portalConsumer.ldapHostDn -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.adminDn" . -}}
{{- else -}}
cn=admin,dc=univention-organization,dc=intranet
{{- end -}}
{{- end -}}

{{- define "portal-consumer.ldap.connection.host" -}}
{{- if .Values.portalConsumer.ldapHost -}}
{{- tpl .Values.portalConsumer.ldapHost . -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.connection.host" . -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.ldap.connection.port" -}}
{{- if .Values.portalConsumer.ldapPort -}}
{{- .Values.portalConsumer.ldapPort -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.connection.port" . -}}
{{- end -}}
{{- end -}}


{{- define "portal-consumer.ldapDomainName" -}}
{{- if .Values.portalConsumer.domainName -}}
{{- .Values.portalConsumer.domainName -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.domainName" . -}}
{{- else -}}
univention-organization.intranet
{{- end -}}
{{- end -}}


{{- /*
These template definitions are only used in this chart and do not relate to templates defined elsewhere.
*/}}

{{- define "portal-consumer.tlsSecretTemplate" -}}
{{- if (index . 2).Release.Name -}}
{{- $secretName := printf "%s-%s-tls" (index . 2).Release.Name (index . 0) -}}
{{- if (index . 1).name -}}
{{- (index . 1).name -}}
{{- else if (index . 2).Values.global.nubusDeployment -}}
{{- $secretName -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.secretTemplate" -}}
{{- if (index . 2).Release.Name -}}
{{- $secretName := printf "%s-%s-credentials" (index . 2).Release.Name (index . 0) -}}
{{- if (index . 1).name -}}
{{- (index . 1).name -}}
{{- else if (index . 2).Values.global.nubusDeployment -}}
{{- $secretName -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.ldap.credentialSecret.name" -}}
{{- include "portal-consumer.secretTemplate" (list "portal-consumer-ldap" .Values.ldap.credentialSecret .) -}}
{{- end -}}

{{- define "portal-consumer.ldap.tlsSecret.name" -}}
{{- include "portal-consumer.tlsSecretTemplate" (list "portal-consumer-ldap" .Values.ldap.tlsSecret .) -}}
{{- end -}}


{{- define "portal-consumer.notifierServer" -}}
{{- if .Values.portalConsumer.notifierServer -}}
{{- .Values.portalConsumer.notifierServer -}}
{{- else -}}
{{- printf "%s-ldap-notifier" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.portalDefaultDn" -}}
{{- if .Values.portalConsumer.portalDefaultDn -}}
{{- .Values.portalConsumer.portalDefaultDn -}}
{{- else -}}
{{- printf "cn=domain,cn=portal,cn=portals,cn=univention,%s" (include "portal-consumer.ldapBaseDn" .) -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.adminGroup" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "cn=Domain Admins,cn=groups,%s" (include "portal-consumer.ldapBaseDn" .) -}}
{{- else -}}
{{- required "The parameter \"portalConsumer.adminGroup\" is required." .Values.portalConsumer.adminGroup -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.authMode" -}}
{{- if .Values.portalConsumer.authMode -}}
{{- .Values.portalConsumer.authMode -}}
{{- else if .Values.global.nubusDeployment -}}
saml
{{- else -}}
{{- default "ucs" .Values.portalConsumer.authMode -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.umcGetUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalConsumer.umcGetUrl\" is required." .Values.portalConsumer.umcGetUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.umcSessionUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get/session-info" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalConsumer.umcSessionUrl\" is required." .Values.portalConsumer.umcSessionUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.udmApiUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.udmRestApi.uri" . -}}
{{- else -}}
{{- required "The parameter \"portalConsumer.udmApiUrl\" is required." .Values.portalConsumer.udmApiUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageEndpoint" -}}
{{- if .Values.portalConsumer.objectStorageEndpoint -}}
{{- tpl .Values.portalConsumer.objectStorageEndpoint . -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "http://%s-minio:9000" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalConsumer.objectStorageEndpoint\" is required." .Values.portalConsumer.objectStorageEndpoint -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageBucket" -}}
{{- if .Values.portalConsumer.objectStorageBucket -}}
{{- tpl .Values.portalConsumer.objectStorageBucket . -}}
{{- else if .Values.global.nubusDeployment -}}
nubus
{{- end -}}
{{- end -}}


{{- define "portal-consumer.objectStorageCredentialSecret.name" -}}
{{- if .Values.portalConsumer.objectStorageCredentialSecret.name -}}
{{- .Values.portalConsumer.objectStorageCredentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-portal-consumer-minio-credentials" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageCredentialSecret.accessKeyKey" -}}
{{- if .Values.portalConsumer.objectStorageCredentialSecret.accessKeyKey -}}
{{- .Values.portalConsumer.objectStorageCredentialSecret.accessKeyKey -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageCredentialSecret.secretKeyKey" -}}
{{- if .Values.portalConsumer.objectStorageCredentialSecret.secretKeyKey -}}
{{- .Values.portalConsumer.objectStorageCredentialSecret.secretKeyKey -}}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageAccessKeyId" -}}
{{- if .Values.portalConsumer.objectStorageCredentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.portalConsumer.objectStorageCredentialSecret.name | quote }}
    key: {{ include "portal-consumer.objectStorageCredentialSecret.accessKeyKey" . | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "portal-consumer.objectStorageCredentialSecret.name" . | quote }}
    key: {{ include "portal-consumer.objectStorageCredentialSecret.accessKeyKey" . | quote }}
{{- else -}}
value: {{ required "The parameter \"portalConsumer.objectStorageAccessKeyId\" is required." .Values.portalConsumer.objectStorageAccessKeyId | quote }}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.objectStorageSecretAccessKey" -}}
{{- if .Values.portalConsumer.objectStorageCredentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.portalConsumer.objectStorageCredentialSecret.name | quote }}
    key: {{ include "portal-consumer.objectStorageCredentialSecret.secretKeyKey" . | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "portal-consumer.objectStorageCredentialSecret.name" . | quote }}
    key: {{ include "portal-consumer.objectStorageCredentialSecret.secretKeyKey" . | quote }}
{{- else -}}
value: {{ required "The parameter \"portalConsumer.objectStorageSecretAccessKey\" is required." .Values.portalConsumer.objectStorageSecretAccessKey | quote }}
{{- end -}}
{{- end -}}

{{- define "portal-consumer.secretVolumeMounts" -}}
{{- $secretMountPath := .Values.portalConsumer.secretMountPath -}}
{{- $tlsSecretName := include "portal-consumer.ldap.tlsSecret.name" . -}}
{{- $credentialSecretName := include "portal-consumer.ldap.credentialSecret.name" . -}}
{{- if $credentialSecretName }}
- name: {{ printf "%s-volume" $credentialSecretName | quote }}
  mountPath: "{{ $secretMountPath }}/ldap_secret"
  subPath: {{ .Values.ldap.credentialSecret.ldapPasswordKey | quote }}
  readOnly: true
- name: {{ printf "%s-volume" $credentialSecretName | quote }}
  mountPath: "{{ $secretMountPath }}/machine_secret"
  subPath: {{ .Values.ldap.credentialSecret.machinePasswordKey | quote }}
  readOnly: true
{{- end }}
{{- if $tlsSecretName }}
- name: {{ printf "%s-volume" $tlsSecretName | quote }}
  mountPath: "{{ $secretMountPath }}/ca_cert"
  subPath: {{ .Values.ldap.tlsSecret.caCertKey | quote }}
  readOnly: true
- name: {{ printf "%s-volume" $tlsSecretName | quote }}
  mountPath: "{{ $secretMountPath }}/cert_pem"
  subPath: {{ .Values.ldap.tlsSecret.certificateKey | quote }}
  readOnly: true
- name: {{ printf "%s-volume" $tlsSecretName | quote }}
  mountPath: "{{ $secretMountPath }}/private_key"
  subPath: {{ .Values.ldap.tlsSecret.privateKeyKey | quote }}
  readOnly: true
{{- end }}
{{- end -}}
