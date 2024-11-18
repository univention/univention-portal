{{- /*
SPDX-FileCopyrightText: 2024 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}

{{- /*
These template definitions are only used in this chart and do not relate to templates defined elsewhere.
*/}}

{{- define "notifiations-api.postgresql.auth.database" -}}
{{- if .Values.postgresql.auth.database -}}
{{- tpl .Values.postgresql.auth.database . -}}
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.connection.host" -}}
{{- if or .Values.postgresql.connection.host .Values.global.postgresql.connection.host -}}
{{- tpl ( coalesce .Values.postgresql.connection.host .Values.global.postgresql.connection.host ) . -}}
{{- else if .Values.postgresql.bundled -}}
{{- printf "%s-postgresql" (include "common.names.fullname" .) -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-postgresql" .Release.Name -}}
{{- else -}}
{{- required ".Values.postgresql.connection.host or .Values.global.postgresql.connection.host must be defined." (coalesce .Values.postgresql.connection.host .Values.global.postgresql.connection.host) -}}
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.connection.port" -}}
{{- if or .Values.postgresql.connection.port .Values.global.postgresql.connection.port -}}
{{- tpl ( coalesce .Values.postgresql.connection.port .Values.global.postgresql.connection.port ) . -}}
{{- else -}}
5432
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.connection.url" -}}
{{- printf "postgresql://$(DB_USERNAME):$(DB_PASSWORD)@%s:%s/$(DATABASE)" (include "notifiations-api.postgresql.connection.host" .) (include "notifiations-api.postgresql.connection.port" .) -}}
{{- end -}}

{{- define "notifications-api.ingress.tls.secretName" -}}
{{- if .Values.ingress.tls.secretName -}}
{{- tpl .Values.ingress.tls.secretName . -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-portal-tls" .Release.Name -}}
{{- else -}}
{{- required ".Values.ingress.tls.secretName must be defined" .Values.ingress.tls.secretName -}}
{{- end -}}
{{- end -}}
