#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
#
# Guardian setup for testing portal tile filtering
#
# Usage: source ./guardian-setup.sh <namespace>
#   or:  ./guardian-setup.sh <namespace>
#
# After running with 'source', GUARDIAN_TOKEN is exported for further use.

set -eo pipefail

NAMESPACE="${1:-}"

if [ -z "$NAMESPACE" ]; then
    echo "Usage: $0 <namespace>"
    echo "   or: source $0 <namespace>  (to export GUARDIAN_TOKEN)"
    echo ""
    echo "Example: source ./$0 jconde"
    return 1 2>/dev/null
fi

echo "=== Guardian Portal Setup for namespace: $NAMESPACE ==="

# Get credentials
binduser="Administrator"
bindpwd=$(kubectl get secret -n "$NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)
echo "*** Got admin password ***"

# Endpoints
CLIENT_ID="guardian-scripts"
KEYCLOAK_URL="https://id.$NAMESPACE.univention.dev/realms/nubus/protocol/openid-connect/token"
GUARDIAN_MANAGEMENT="https://portal.$NAMESPACE.univention.dev/guardian/management"
GUARDIAN_AUTH="https://portal.$NAMESPACE.univention.dev/guardian/authorization"
UDM_API="https://portal.$NAMESPACE.univention.dev/univention/udm"

# Get token
echo "*** Getting Guardian token ***"
token=$(curl -s -d "client_id=$CLIENT_ID" \
     -d "username=$binduser" \
     -d "password=$bindpwd" \
     -d "grant_type=password" \
     "$KEYCLOAK_URL" | jq -r '.access_token')
export GUARDIAN_TOKEN="$token"

if [ -z "$GUARDIAN_TOKEN" ] || [ "$GUARDIAN_TOKEN" = "null" ]; then
    echo "ERROR: Failed to get token"
    exit 1
fi
echo "Got token: ${GUARDIAN_TOKEN:0:20}..."

# Register app
echo "*** Registering univention-portal app ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{"name":"univention-portal", "display_name":"Univention Portal"}' \
    "$GUARDIAN_MANAGEMENT/apps/register" | jq .

# Create namespace
echo "*** Creating portal namespace ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{"name":"portal", "display_name":"Portal"}' \
    "$GUARDIAN_MANAGEMENT/namespaces/univention-portal" | jq .

# Create role
echo "*** Creating admin-tile-viewer role ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{"name":"admin-tile-viewer", "display_name":"Admin Tile Viewer"}' \
    "$GUARDIAN_MANAGEMENT/roles/univention-portal/portal" | jq .

# Create permission
echo "*** Creating view-admin-tiles permission ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{"name":"view-admin-tiles", "display_name":"View Admin Tiles"}' \
    "$GUARDIAN_MANAGEMENT/permissions/univention-portal/portal" | jq .

# Create capability (connects role to permission)
echo "*** Creating capability: admin-tile-viewer can view admin tiles ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{
          "name": "admin-tile-viewer-can-view-admin-tiles",
          "display_name": "Admin tile viewer can view admin tiles",
          "role": {
            "app_name": "univention-portal",
            "namespace_name": "portal",
            "name": "admin-tile-viewer"
          },
          "conditions": [],
          "relation": "AND",
          "permissions": [
            {
              "app_name": "univention-portal",
              "namespace_name": "portal",
              "name": "view-admin-tiles"
            }
           ]
        }' \
    "$GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal" | jq .

# Create test user with the role
echo "*** Creating test user 'guardian-test' with admin-tile-viewer role ***"
curl -s -X POST \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -u "$binduser:$bindpwd" \
    -d '{
        "properties": {
            "firstname": "Guardian",
            "lastname": "Test",
            "username": "guardian-test",
            "password": "univention",
            "guardianRoles": ["univention-portal:portal:admin-tile-viewer"]
        }
    }' \
    "$UDM_API/users/user/" | jq .

# Verify by checking permissions for the test user
echo "*** Verifying: Check permissions for user with admin-tile-viewer role ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $GUARDIAN_TOKEN" \
    -d '{
          "namespaces": [
            {
              "app_name": "univention-portal",
              "name": "portal"
            }
          ],
          "actor": {
            "id": "guardian-test",
            "roles": [
              {
                "app_name": "univention-portal",
                "namespace_name": "portal",
                "name": "admin-tile-viewer"
              }
            ],
            "attributes": {}
          },
          "include_general_permissions": true,
          "extra_request_data": {}
        }' \
    "$GUARDIAN_AUTH/permissions" | jq .

# Create Guardian Management UI tile
echo "*** Creating Guardian Management UI tile ***"
LDAP_BASE="${2:-dc=swp-ldap,dc=internal}"
PORTAL_ENTRIES_POSITION="cn=entry,cn=portals,cn=univention,$LDAP_BASE"
DOMAIN_ADMIN_CATEGORY_DN="cn=domain-admin,cn=category,cn=portals,cn=univention,$LDAP_BASE"

# Create the Guardian entry
curl -s -X POST \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -u "$binduser:$bindpwd" \
    -d "{
        \"position\": \"$PORTAL_ENTRIES_POSITION\",
        \"properties\": {
            \"name\": \"guardian\",
            \"activated\": true,
            \"anonymous\": false,
            \"displayName\": {
                \"en_US\": \"Guardian\",
                \"de_DE\": \"Guardian\"
            },
            \"description\": {
                \"en_US\": \"Guardian Management UI - Manage roles, permissions and capabilities\",
                \"de_DE\": \"Guardian Management UI - Rollen, Berechtigungen und Capabilities verwalten\"
            },
            \"link\": [[\"en_US\", \"https://portal.$NAMESPACE.univention.dev/univention/guardian/management-ui\"]],
            \"linkTarget\": \"newwindow\",
            \"allowedGroups\": [\"cn=Domain Admins,cn=groups,$LDAP_BASE\"]
        }
    }" \
    "$UDM_API/portals/entry/" | jq -r '.dn // .error.message // "created"'

# Add the Guardian entry to the domain-admin category
echo "*** Adding Guardian tile to domain-admin category ***"
category_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$DOMAIN_ADMIN_CATEGORY_DN', safe=''))")

# Get current entries in the category
current_entries=$(curl -s \
    -H "Accept: application/json" \
    -u "$binduser:$bindpwd" \
    "$UDM_API/portals/category/$category_dn_encoded" | jq -r '.properties.entries')

# Add guardian entry to the list
guardian_entry_dn="cn=guardian,$PORTAL_ENTRIES_POSITION"
updated_entries=$(echo "$current_entries" | jq ". + [\"$guardian_entry_dn\"] | unique")

# Update the category
curl -s -X PATCH \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -u "$binduser:$bindpwd" \
    -d "{\"properties\": {\"entries\": $updated_entries}}" \
    "$UDM_API/portals/category/$category_dn_encoded" | jq -r '.dn // "updated"'

echo "=== Setup Complete ==="
echo "Test user created:"
echo "  Username: guardian-test"
echo "  Password: univention"
echo "  Role: univention-portal:portal:admin-tile-viewer"
echo "  Permission: view-admin-tiles"
echo "When this user logs in, the portal should fetch the permission 'view-admin-tiles' from Guardian and filter tiles accordingly."
echo ""
echo "# View permissions:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/permissions/univention-portal/portal | jq ."
echo "# List roles:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/roles/univention-portal/portal | jq ."
echo "# List capabilities:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal | jq ."
