#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

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

IFS='' read -r -d '' SELFSERVICE_TEMPLATE <<"EOF" || true
{
  "selfservice_portal_dn": $selfservice_portal_dn,
  "selfservice_portal_cache_url": $selfservice_portal_cache_url
}
EOF

jq -n \
  --arg selfservice_portal_dn "cn=self-service,cn=portal,cn=portals,cn=univention,${LDAP_BASE_DN:-}" \
  --arg selfservice_portal_cache_url "${PORTAL_SERVER_UCS_INTERNAL_URL}/selfservice" \
  "${SELFSERVICE_TEMPLATE}" > "/usr/lib/univention-portal/config/selfservice.json"

IFS='' read -r -d '' JQ_TEMPLATE <<"EOF" || true
{
  "admin_groups": [
    $admin_group
  ],
  "assets_root": $assets_root,
  "auth_mode": $auth_mode,
  "default_domain_dn": $default_domain_dn,
  "editable": $editable,
  "enable_xheaders": true,
  "groups_cache_url": $groups_cache_url,
  "hostdn": $hostdn,
  "ldap_base": $ldap_base,
  "ldap_uri": $ldap_uri,
  "port": $port,
  "portal_cache_url": $portal_cache_url,
  "ucs_internal_url": $ucs_internal_url,
  "udm_api_url": $udm_api_url,
  "udm_api_username": $udm_api_username,
  "udm_api_password_file": $udm_api_password_file,
  "umc_get_url": $umc_get_url,
  "umc_session_url": $umc_session_url,
  "umc_check_icons": $umc_check_icons
}
EOF

echo "Generating ${JSON_PATH}"

jq -n \
  --arg admin_group "${PORTAL_SERVER_ADMIN_GROUP}" \
  --arg assets_root "${PORTAL_SERVER_ASSETS_ROOT:-/usr/share/univention-portal}" \
  --arg auth_mode "${PORTAL_SERVER_AUTH_MODE}" \
  --arg default_domain_dn "${PORTAL_DEFAULT_DN:-}" \
  --argjson editable "${PORTAL_SERVER_EDITABLE}" \
  --arg groups_cache_url "${PORTAL_SERVER_UCS_INTERNAL_URL}/groups" \
  --arg hostdn "${LDAP_HOST_DN:-}" \
  --arg ldap_base "${LDAP_BASE_DN:-}" \
  --arg ldap_uri "ldap://${LDAP_HOST:-}:${LDAP_PORT-}" \
  --arg port "${PORTAL_SERVER_PORT}" \
  --arg portal_cache_url "${PORTAL_SERVER_UCS_INTERNAL_URL}/portal" \
  --arg ucs_internal_url "${PORTAL_SERVER_UCS_INTERNAL_URL}" \
  --arg udm_api_url "${PORTAL_UDM_API_URL:-}" \
  --arg udm_api_username "${PORTAL_UDM_API_USERNAME:-}" \
  --arg udm_api_password_file "${PORTAL_UDM_API_PASSWORD_FILE:-}" \
  --arg umc_get_url "${PORTAL_SERVER_UMC_GET_URL}" \
  --arg umc_session_url "${PORTAL_SERVER_UMC_SESSION_URL}" \
  --argjson umc_check_icons "${PORTAL_SERVER_UMC_CHECK_ICONS}" \
  --arg selfservice_portal_dn "cn=self-service,cn=portal,cn=portals,cn=univention,${LDAP_BASE_DN:-dn=univention-organization,dn=intranet}" \
  "${JQ_TEMPLATE}" > "${JSON_PATH}"

if [[ "${PORTAL_SERVER_CENTRAL_NAVIGATION_ENABLED:-}" == "true" ]]; then
  echo "Activating central navigation via the UMCAndSecretAuthenticator"

  PORTALS_JSON="/usr/share/univention-portal/portals.json"
  TEMP_FILE=$(mktemp)
  jq '.default.kwargs.authenticator.class = "UMCAndSecretAuthenticator"' $PORTALS_JSON > $TEMP_FILE
  mv $TEMP_FILE $PORTALS_JSON

  echo '{"portal-secret-file": "/var/secrets/authenticator.secret"}' > /usr/lib/univention-portal/config/authenticator_secret_location.json
fi

exec "$@"

# [EOF]
