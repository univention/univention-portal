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

{{- define "portal-consumer.ldap.connection.host" -}}
{{- tpl
  ( required
    "The LDAP connection has to be configured, ldap.connection.host"
    ( coalesce .Values.ldap.connection.host .Values.global.ldap.connection.host )
) . -}}
{{- end -}}

{{- define "portal-consumer.ldap.connection.port" -}}
{{- tpl
  ( required
    "The LDAP connection has to be configured, ldap.connection.port"
    ( coalesce .Values.ldap.connection.port .Values.global.ldap.connection.port "389" )
  ) . -}}
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

{{- define "portal-consumer.provisioningApi.auth.credentialSecret.name" -}}

{{- /* TODO: Interim support for "existingSecret.name" to help with the secrets transition */}}
{{- if .Values.provisioningApi.auth.existingSecret.name }}
{{- tpl .Values.provisioningApi.auth.existingSecret.name . }}

{{- /* TODO: Below code is the original implementation */}}
{{- else if .Values.provisioningApi.auth.credentialSecret.name -}}
{{- .Values.provisioningApi.auth.credentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-portal-consumer-credentials" .Release.Name -}}
{{- else -}}
{{ required ".Values.provisioningApi.auth.password must be defined." .Values.provisioningApi.auth.password}}
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
