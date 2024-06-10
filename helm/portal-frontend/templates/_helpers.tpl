{{- define "portalFrontend.branding.css" -}}
{{- if .Values.portalFrontend.branding.css -}}
{{- .Values.portalFrontend.branding.css -}}
{{- else -}}
{{ .Files.Get "branding/custom.css" | b64enc }}
{{- end -}}
{{- end -}}

{{- define "portalFrontend.branding.favicon" -}}
{{- if .Values.portalFrontend.branding.favicon -}}
{{- .Values.portalFrontend.branding.favicon -}}
{{- else -}}
{{ .Files.Get "branding/favicon.ico" | b64enc }}
{{- end -}}
{{- end -}}

{{- define "portalFrontend.branding.logo" -}}
{{- if .Values.portalFrontend.branding.logo -}}
{{- .Values.portalFrontend.branding.logo -}}
{{- else -}}
{{ .Files.Get "branding/logo.svg" | b64enc }}
{{- end -}}
{{- end -}}

{{- define "portalFrontend.branding.backgroundImage" -}}
{{- if .Values.portalFrontend.branding.backgroundImage -}}
{{- .Values.portalFrontend.branding.backgroundImage -}}
{{- else -}}
{{ .Files.Get "branding/portal_background_image.svg" | b64enc }}
{{- end -}}
{{- end -}}
