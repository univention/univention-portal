{{/*
 Default secret name.

 Usage:

 {{ include "nubus-common.secrets.name" (dict "existingSecret" .Values.path.to.the.existingSecret "defaultNameSuffix" "my-suffix" "context" .) }}

 Params:

 - existingSecret - ExistingSecret - Optional. The generated name will be based on this
   value if a configuration for an existing Secret is provided.

 - defaultNameSuffix - String - Optional. This value will be appended as a suffix
   if the default name is used. This value is ignored if "existingSecret" does
   configure a different name.

 - context - Dict - Required. The context for the template evaluation.

 */}}

{{- define "nubus-common.secrets.name" -}}
{{- $name := printf "%s-%s" (include "common.names.fullname" .context) .defaultNameSuffix | trunc 63 | trimSuffix "-" }}

{{- if (.existingSecret).name -}}
{{- $name = tpl .existingSecret.name .context -}}
{{- end -}}

{{- printf "%s" $name -}}
{{- end -}}


{{/*
 Generate the secret key.

 The generated key will take into account the configuration from the
 parameter "existingSecret". It will fall back to the value of "key"
 if there is no mapping configured for the key.

 Usage:

 {{ include "nubus-common.secrets.key" (dict "existingSecret" .Values.path.to.the.existingSecret "key" "keyName") }}

 Params:

 - existingSecret - ExistingSecret - Optional. The path to the existing
   secrets in the values.yaml given by the user to be used instead of the default one.

 - key - String - Required. Name of the key in the secret.

 */}}

{{- define "nubus-common.secrets.key" -}}
{{- $_ := required "Variable .key is required" .key -}}
{{- default .key (get (.existingSecret).keyMapping .key) -}}
{{- end -}}
