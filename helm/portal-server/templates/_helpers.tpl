{{- /*
SPDX-FileCopyrightText: 2024 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}
{{- /*
These template definitions relate to the use of this Helm chart as a sub-chart of the Nubus Umbrella Chart.
Templates defined in other Helm sub-charts are imported to be used to configure this chart.
If the value .Values.global.nubusDeployment equates to true, the defined templates are imported.
*/}}
{{- define "portal-server.ldapBaseDn" -}}
{{- if .Values.portalServer.ldapBaseDn -}}
{{- .Values.portalServer.ldapBaseDn -}}
{{- else if .Values.global.nubusDeployment -}}
{{- include "nubusTemplates.ldapServer.ldap.baseDn" . -}}
{{- else -}}
dc=univention-organization,dc=intranet
{{- end -}}
{{- end -}}

{{- /*
These template definitions are only used in this chart and do not relate to templates defined elsewhere.
*/}}
{{- define "portal-server.adminGroup" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "cn=Domain Admins,cn=groups,%s" (include "portal-server.ldapBaseDn" .) -}}
{{- else -}}
{{- required "The parameter \"portalServer.adminGroup\" is required." .Values.portalServer.adminGroup -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.authMode" -}}
{{- if .Values.portalServer.authMode -}}
{{- .Values.portalServer.authMode -}}
{{- else if .Values.global.nubusDeployment -}}
saml
{{- else -}}
{{- default "ucs" .Values.portalServer.authMode -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.umcGetUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalServer.umcGetUrl\" is required." .Values.portalServer.umcGetUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.umcSessionUrl" -}}
{{- if .Values.global.nubusDeployment -}}
{{- printf "http://%s-umc-server/get/session-info" .Release.Name -}}
{{- else -}}
{{- required "The parameter \"portalServer.umcSessionUrl\" is required." .Values.portalServer.umcSessionUrl -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageEndpoint" -}}
{{- if  .Values.portalServer.objectStorageEndpoint -}}
{{- .Values.portalServer.objectStorageEndpoint -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "http://%s-minio:9000" .Release.Name -}}
{{- else -}}
http://ums-minio:9000
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageBucket" -}}
{{- if .Values.portalServer.objectStorageBucket -}}
{{- .Values.portalServer.objectStorageBucket -}}
{{- else if .Values.global.nubusDeployment -}}
ums
{{- else -}}
ums
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageAccessKeyId" -}}
{{- if not .Values.global.nubusDeployment -}}
{{- required "The parameter \"portalServer.objectStorageAccessKeyId\" is required." .Values.portalServer.objectStorageAccessKeyId -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageSecretAccessKey" -}}
{{- if not .Values.global.nubusDeployment -}}
{{- required "The parameter \"portalServer.objectStorageSecretAccessKey\" is required." .Values.portalServer.objectStorageSecretAccessKey -}}
{{- end -}}
{{- end -}}


{{- define "portal-server.objectStorageCredentialSecret.name" -}}
{{- if .Values.portalServer.objectStorageCredentialSecret.name -}}
{{- .Values.portalServer.objectStorageCredentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-portal-server-minio-credentials" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageCredentialSecret.accessKeyKey" -}}
{{- if .Values.portalServer.objectStorageCredentialSecret.accessKeyKey -}}
{{- .Values.portalServer.objectStorageCredentialSecret.accessKeyKey -}}
{{- end -}}
{{- end -}}

{{- define "portal-server.objectStorageCredentialSecret.secretKeyKey" -}}
{{- if .Values.portalServer.objectStorageCredentialSecret.secretKeyKey -}}
{{- .Values.portalServer.objectStorageCredentialSecret.secretKeyKey -}}
{{- end -}}
{{- end -}}
