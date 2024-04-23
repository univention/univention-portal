{{- /*
SPDX-FileCopyrightText: 2024 Univention GmbH
SPDX-License-Identifier: AGPL-3.0-only
*/}}
{{- /*
These template definitions are only used in this chart and do not relate to templates defined elsewhere.
*/}}
{{- define "notifiations-api.postgresql.auth.username" -}}
{{- if .Values.postgresql.auth.username -}}
{{- .Values.postgresql.auth.username -}}
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.auth.credentialSecret.name" -}}
{{- if .Values.postgresql.auth.existingSecret -}}
{{- .Values.postgresql.auth.existingSecret -}}
{{- else if .Values.postgresql.auth.credentialSecret.name -}}
{{- .Values.postgresql.auth.credentialSecret.name -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "%s-notifications-api-postgresql-credentials" .Release.Name -}}
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.auth.credentialSecret.key" -}}
{{- if .Values.postgresql.auth.existingSecret -}}
{{- .Values.postgresql.auth.secretKeys.userPasswordKey -}}
{{- else if .Values.postgresql.auth.credentialSecret.key -}}
{{- .Values.postgresql.auth.credentialSecret.key -}}
{{- else if .Values.global.nubusDeployment -}}
password
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.auth.database" -}}
{{- if .Values.postgresql.auth.database -}}
{{- .Values.postgresql.auth.database -}}
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.connection.port" -}}
{{- if or .Values.postgresql.connection.port .Values.global.postgresql.connection.port -}}
{{- coalesce .Values.postgresql.connection.port .Values.global.postgresql.connection.port -}}
{{- else -}}
5432
{{- end -}}
{{- end -}}

{{- define "notifiations-api.postgresql.connection.url" -}}
{{- if .Values.postgresql.bundled }}
{{- printf "postgresql://$(DB_USERNAME):$(DB_PASSWORD)@%s:%s/$(DATABASE)" (printf "%s-postgresql" (include "common.names.fullname" .))  .Values.postgresql.connection.port -}}
{{- else if .Values.global.nubusDeployment -}}
{{- printf "postgresql://$(DB_USERNAME):$(DB_PASSWORD)@%s:%s/$(DATABASE)" (printf "%s-postgresql" .Release.Name) (include "notifiations-api.postgresql.connection.port" .) -}}
{{- else -}}
{{- printf "postgresql://$(DB_USERNAME):$(DB_PASSWORD)@%s:%s/$(DATABASE)" (coalesce .Values.postgresql.connection.host .Values.global.postgresql.connection.host) (include "notifiations-api.postgresql.connection.port" .) -}}
{{- end -}}
{{- end -}}
