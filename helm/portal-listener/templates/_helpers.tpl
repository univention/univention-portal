{{- /*
SPDX-FileCopyrightText: 2024 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}
{{- /*
These template definitions relate to the use of this Helm chart as a sub-chart of the Nubus Umbrella Chart.
Templates defined in other Helm sub-charts are imported to be used to configure this chart.
If the value .Values.global.nubusDeployment equates to true, the defined templates are imported.
*/}}
{{- define "portal-listener.ldapBaseDn" -}}
{{- if .Values.portalListener.ldapBaseDn -}}
{{- .Values.portalListener.ldapBaseDn -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.baseDn" . -}}
{{- else -}}
dc=univention-organization,dc=intranet
{{- end -}}
{{- end -}}

{{- define "portal-listener.ldapAdminDn" -}}
{{- if .Values.portalListener.ldapHostDn -}}
{{- .Values.portalListener.ldapHostDn -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.adminDn" . -}}
{{- else -}}
cn=admin,dc=univention-organization,dc=intranet
{{- end -}}
{{- end -}}

{{- define "portal-listener.ldap.connection.host" -}}
{{- if .Values.portalListener.ldapHost -}}
{{- tpl .Values.portalListener.ldapHost . -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.connection.host" . -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.ldap.connection.port" -}}
{{- if .Values.portalListener.ldapPort -}}
{{- .Values.portalListener.ldapPort -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.connection.port" . -}}
{{- end -}}
{{- end -}}


{{- define "portal-listener.ldapDomainName" -}}
{{- if .Values.portalListener.domainName -}}
{{- .Values.portalListener.domainName -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.domainName" . -}}
{{- else -}}
univention-organization.intranet
{{- end -}}
{{- end -}}


{{- /*
These template definitions are only used in this chart and do not relate to templates defined elsewhere.
*/}}

{{- define "portal-listener.tlsSecretTemplate" -}}
{{- if (index . 2).Release.Name -}}
{{- $secretName := printf "%s-%s-tls" (index . 2).Release.Name (index . 0) -}}
{{- if (index . 1).name -}}
{{- (index . 1).name -}}
{{- else if (index . 2).Values.global.nubusDeployment -}}
{{- $secretName -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.secretTemplate" -}}
{{- if (index . 2).Release.Name -}}
{{- $secretName := printf "%s-%s-credentials" (index . 2).Release.Name (index . 0) -}}
{{- if (index . 1).name -}}
{{- (index . 1).name -}}
{{- else if (index . 2).Values.global.nubusDeployment -}}
{{- $secretName -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.ldap.credentialSecret.name" -}}
{{- include "portal-listener.secretTemplate" (list "portal-listener-ldap" .Values.ldap.credentialSecret .) -}}
{{- end -}}

{{- define "portal-listener.ldap.tlsSecret.name" -}}
{{- include "portal-listener.tlsSecretTemplate" (list "portal-listener-ldap" .Values.ldap.tlsSecret .) -}}
{{- end -}}


{{- define "portal-listener.notifierServer" -}}
{{- if .Values.portalListener.notifierServer -}}
{{- .Values.portalListener.notifierServer -}}
{{- else -}}
{{- printf "%s-ldap-notifier" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.portalDefaultDn" -}}
{{- if .Values.portalListener.portalDefaultDn -}}
{{- .Values.portalListener.portalDefaultDn -}}
{{- else -}}
{{- printf "cn=domain,cn=portal,cn=portals,cn=univention,%s" (include "portal-listener.ldapBaseDn" .) -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.adminGroup" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "cn=Domain Admins,cn=groups,%s" (include "portal-listener.ldapBaseDn" .) -}}
{{- else -}}
{{- required "The parameter \"portalListener.adminGroup\" is required." .Values.portalListener.adminGroup -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.authMode" -}}
{{- if .Values.portalListener.authMode -}}
{{- .Values.portalListener.authMode -}}
{{- else if .Values.global.nubusDeployment -}}
saml
{{- else -}}
{{- default "ucs" .Values.portalListener.authMode -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.umcGetUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalListener.umcGetUrl\" is required." .Values.portalListener.umcGetUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.umcSessionUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get/session-info" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalListener.umcSessionUrl\" is required." .Values.portalListener.umcSessionUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.udmApiUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.udmRestApi.uri" . -}}
{{- else -}}
{{- required "The parameter \"portalListener.udmApiUrl\" is required." .Values.portalListener.udmApiUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageEndpoint" -}}
{{- if  .Values.portalListener.objectStorageEndpoint -}}
{{- .Values.portalListener.objectStorageEndpoint -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "http://%s-minio:9000" .Release.Name -}}
{{- else -}}
http://ums-minio:9000
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageBucket" -}}
{{- if .Values.portalListener.objectStorageBucket -}}
{{- .Values.portalListener.objectStorageBucket -}}
{{- else if .Values.global.nubusDeployment -}}
ums
{{- else -}}
ums
{{- end -}}
{{- end -}}


{{- define "portal-listener.objectStorageCredentialSecret.name" -}}
{{- if .Values.portalListener.objectStorageCredentialSecret.name -}}
{{- .Values.portalListener.objectStorageCredentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-portal-listener-minio-credentials" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageCredentialSecret.accessKeyKey" -}}
{{- if .Values.portalListener.objectStorageCredentialSecret.accessKeyKey -}}
{{- .Values.portalListener.objectStorageCredentialSecret.accessKeyKey -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageCredentialSecret.secretKeyKey" -}}
{{- if .Values.portalListener.objectStorageCredentialSecret.secretKeyKey -}}
{{- .Values.portalListener.objectStorageCredentialSecret.secretKeyKey -}}
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageAccessKeyId" -}}
{{- if .Values.portalListener.objectStorageCredentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.portalListener.objectStorageCredentialSecret.name | quote }}
    key: {{ include "portal-listener.objectStorageCredentialSecret.accessKeyKey" . | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "portal-listener.objectStorageCredentialSecret.name" . | quote }}
    key: {{ include "portal-listener.objectStorageCredentialSecret.accessKeyKey" . | quote }}
{{- else -}}
value: {{ required "The parameter \"portalListener.objectStorageAccessKeyId\" is required." .Values.portalListener.objectStorageAccessKeyId | quote }}
{{- end -}}
{{- end -}}

{{- define "portal-listener.objectStorageSecretAccessKey" -}}
{{- if .Values.portalListener.objectStorageCredentialSecret.name -}}
valueFrom:
  secretKeyRef:
    name: {{ .Values.portalListener.objectStorageCredentialSecret.name | quote }}
    key: {{ include "portal-listener.objectStorageCredentialSecret.secretKeyKey" . | quote }}
{{- else if .Values.global.nubusDeployment -}}
valueFrom:
  secretKeyRef:
    name: {{ include "portal-listener.objectStorageCredentialSecret.name" . | quote }}
    key: {{ include "portal-listener.objectStorageCredentialSecret.secretKeyKey" . | quote }}
{{- else -}}
value: {{ required "The parameter \"portalListener.objectStorageSecretAccessKey\" is required." .Values.portalListener.objectStorageSecretAccessKey | quote }}
{{- end -}}
{{- end -}}

{{- define "portal-listener.secretVolumeMounts" -}}
{{- $secretMountPath := .Values.portalListener.secretMountPath -}}
{{- $tlsSecretName := include "portal-listener.ldap.tlsSecret.name" . -}}
{{- $credentialSecretName := include "portal-listener.ldap.credentialSecret.name" . -}}
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
