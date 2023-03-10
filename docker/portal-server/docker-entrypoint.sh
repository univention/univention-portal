#!/bin/bash
set -euo pipefail

JSON_PATH="/usr/lib/univention-portal/config/config.json"

PORTAL_SERVER_AUTH_MODE="${PORTAL_SERVER_AUTH_MODE:-ucs}"
PORTAL_SERVER_EDITABLE="${PORTAL_SERVER_EDITABLE:-true}"
PORTAL_SERVER_PORT="${PORTAL_SERVER_PORT:-80}"
PORTAL_SERVER_UMC_CHECK_ICONS="${PORTAL_SERVER_UMC_CHECK_ICONS:-false}"

if [[ -z "${PORTAL_SERVER_ADMIN_GROUP:-}" ]]; then
  echo "Please set the environmental variable PORTAL_SERVER_ADMIN_GROUP"
  exit 126
fi

if [[ -z "${PORTAL_SERVER_UCS_INTERNAL_URL:-}" ]]; then
  echo "Please set the environmental variable PORTAL_SERVER_UCS_INTERNAL_URL"
  exit 126
fi

if [[ -z "${PORTAL_SERVER_UMC_GET_URL:-}" ]]; then
  echo "Please set the environmental variable PORTAL_SERVER_UMC_GET_URL"
  exit 126
fi

if [[ -z "${PORTAL_SERVER_UMC_SESSION_URL:-}" ]]; then
  echo "Please set the environmental variable PORTAL_SERVER_UMC_SESSION_URL"
  exit 126
fi

if [[ -z "${PORTAL_SERVER_AUTH_SECRET:-}" ]]; then
  echo "Please set the environmental variable PORTAL_SERVER_AUTH_SECRET"
  exit 126
fi

IFS='' read -r -d '' JQ_TEMPLATE <<"EOF" || true
{
  "admin_groups": [
    $admin_group
  ],
  "auth_mode": $auth_mode,
  "editable": $editable,
  "port": $port,
  "auth_secret": $auth_secret,
  "ucs_internal_url": $ucs_internal_url,
  "umc_get_url": $umc_get_url,
  "umc_session_url": $umc_session_url,
  "umc_check_icons": $umc_check_icons
}
EOF

echo "Generating ${JSON_PATH}"

jq -n \
  --arg admin_group "${PORTAL_SERVER_ADMIN_GROUP}" \
  --arg auth_mode "${PORTAL_SERVER_AUTH_MODE}" \
  --argjson editable "${PORTAL_SERVER_EDITABLE}" \
  --arg port "${PORTAL_SERVER_PORT}" \
  --arg auth_secret "${PORTAL_SERVER_AUTH_SECRET}" \
  --arg ucs_internal_url "${PORTAL_SERVER_UCS_INTERNAL_URL}" \
  --arg umc_get_url "${PORTAL_SERVER_UMC_GET_URL}" \
  --arg umc_session_url "${PORTAL_SERVER_UMC_SESSION_URL}" \
  --argjson umc_check_icons "${PORTAL_SERVER_UMC_CHECK_ICONS}" \
  "${JQ_TEMPLATE}" > "${JSON_PATH}"

exec "$@"

# [EOF]
