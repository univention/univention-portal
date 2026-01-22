#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
#
# Setup conditional service tiles (Nextcloud, OX)
#
# This script configures the Nextcloud and OX tiles to be shown/hidden based
# on user attributes (nextcloudEnabled, isOxUser) using Guardian conditions.
#
# How it works:
#   1. Creates Guardian permissions for viewing each tile
#   2. Creates an "authenticated-user" role
#   3. Creates capabilities with actor_field_equals_value conditions
#   4. Updates existing tiles with guardianPermissionView
#   5. Assigns the role to Domain Users group
#
# After running this script:
#   - Users with nextcloudEnabled=true will see the Nextcloud tile
#   - Users with isOxUser=true will see the OX tile
#   - No per-user role assignment needed - just toggle the attribute!
#
# Usage: ./setup-conditional-service-tiles.sh <namespace> [ldap-base]
#
# Examples:
#   ./setup-conditional-service-tiles.sh jconde
#   ./setup-conditional-service-tiles.sh jconde dc=example,dc=com

set -eo pipefail

NAMESPACE="${1:-}"
LDAP_BASE="${2:-dc=swp-ldap,dc=internal}"

if [ -z "$NAMESPACE" ]; then
    echo "Usage: $0 <namespace> [ldap-base]"
    echo ""
    echo "This script configures Nextcloud and OX tiles to be shown/hidden"
    echo "based on user attributes (nextcloudEnabled, isOxUser)."
    echo ""
    echo "After running:"
    echo "  - Users with nextcloudEnabled=true see the Nextcloud tile"
    echo "  - Users with isOxUser=true see the OX tile"
    exit 1
fi

echo "=== Setup Conditional Service Tiles ==="
echo "Namespace: $NAMESPACE"
echo "LDAP Base: $LDAP_BASE"

# Configuration
DOMAIN_USERS_DN="cn=Domain Users,cn=groups,$LDAP_BASE"

# Get credentials
binduser="Administrator"
bindpwd=$(kubectl get secret -n "$NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)
echo "*** Got admin password ***"

# Endpoints
CLIENT_ID="guardian-scripts"
KEYCLOAK_URL="https://id.$NAMESPACE.univention.dev/realms/nubus/protocol/openid-connect/token"
GUARDIAN_MANAGEMENT="https://portal.$NAMESPACE.univention.dev/guardian/management"
GUARDIAN_AUTHORIZATION="https://portal.$NAMESPACE.univention.dev/guardian/authorization"
UDM_API="https://portal.$NAMESPACE.univention.dev/univention/udm"

# Get Guardian token
echo "*** Getting Guardian token ***"
token=$(curl -s -d "client_id=$CLIENT_ID" \
     -d "username=$binduser" \
     -d "password=$bindpwd" \
     -d "grant_type=password" \
     "$KEYCLOAK_URL" | jq -r '.access_token')

if [ -z "$token" ] || [ "$token" = "null" ]; then
    echo "ERROR: Failed to get Guardian token"
    exit 1
fi
echo "Got token: ${token:0:20}..."

create_guardian_permission() {
    local name="$1"
    local display_name="$2"
    echo "  Creating permission: $name"
    result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"name\":\"$name\", \"display_name\":\"$display_name\"}" \
        "$GUARDIAN_MANAGEMENT/permissions/univention-portal/portal")
    echo "$result" | jq -r '.name // .detail // .message // "created"'
}

create_guardian_role() {
    local name="$1"
    local display_name="$2"
    echo "Creating role: $name"
    result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"name\":\"$name\", \"display_name\":\"$display_name\"}" \
        "$GUARDIAN_MANAGEMENT/roles/univention-portal/portal")
    echo "$result" | jq -r '.name // .detail // .message // "created"'
}

create_conditional_capability() {
    # Creates a capability with actor_field_equals_value condition
    local name="$1"
    local display_name="$2"
    local role_name="$3"
    local permission_name="$4"
    local field="$5"
    local value="$6"

    echo "Creating capability: $name"
    echo "Condition: $field == $value"

    result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
              \"name\": \"$name\",
              \"display_name\": \"$display_name\",
              \"role\": {
                \"app_name\": \"univention-portal\",
                \"namespace_name\": \"portal\",
                \"name\": \"$role_name\"
              },
              \"conditions\": [
                {
                  \"app_name\": \"guardian\",
                  \"namespace_name\": \"builtin\",
                  \"name\": \"actor_field_equals_value\",
                  \"parameters\": [
                    {\"name\": \"field\", \"value\": \"$field\"},
                    {\"name\": \"value\", \"value\": $value}
                  ]
                }
              ],
              \"relation\": \"AND\",
              \"permissions\": [
                {
                  \"app_name\": \"univention-portal\",
                  \"namespace_name\": \"portal\",
                  \"name\": \"$permission_name\"
                }
              ]
            }" \
        "$GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal")
    echo "$result" | jq -r '.name // .detail // .message // "created"'
}

update_tile_guardian_permission() {
    local tile_name="$1"
    local permission="$2"

    echo "Updating tile: $tile_name"
    echo "Setting guardianPermissionView: $permission"

    tile_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('cn=$tile_name,cn=entry,cn=portals,cn=univention,$LDAP_BASE', safe=''))")

    response=$(curl -s -w "\n%{http_code}" -X PATCH \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{\"properties\": {\"guardianPermissionView\": \"$permission\"}}" \
        "$UDM_API/portals/entry/$tile_dn_encoded")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "OK (HTTP $http_code)"
    else
        echo "ERROR: HTTP $http_code - $(echo "$body" | jq -r '.error.message // .title // "unknown error"' 2>/dev/null || echo "$body")"
    fi
}

assign_role_to_group() {
    local group_dn="$1"
    local role="$2"

    echo "Assigning role to group: $group_dn"
    echo "Role: $role"

    group_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$group_dn', safe=''))")

    # Get current guardianMemberRoles
    current_roles=$(curl -s -H "Accept: application/json" -u "$binduser:$bindpwd" \
        "$UDM_API/groups/group/$group_dn_encoded" | jq -r '.properties.guardianMemberRoles // []')

    # Check if role already assigned
    if echo "$current_roles" | jq -e ".[] | select(. == \"$role\")" > /dev/null 2>&1; then
        echo "Role already assigned"
        return 0
    fi

    # Add new role
    new_roles=$(echo "$current_roles" | jq ". + [\"$role\"]")

    response=$(curl -s -w "\n%{http_code}" -X PATCH \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{\"properties\": {\"guardianMemberRoles\": $new_roles}}" \
        "$UDM_API/groups/group/$group_dn_encoded")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "OK (HTTP $http_code)"
    else
        echo "ERROR: HTTP $http_code - $(echo "$body" | jq -r '.error.message // .title // "unknown error"' 2>/dev/null || echo "$body")"
    fi
}

test_guardian_condition() {
    local test_name="$1"
    local field="$2"
    local value="$3"
    local expected_permission="$4"
    local should_have="$5"  # "yes" or "no"

    echo "Test: $test_name"

    result=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{
              \"namespaces\": [{\"app_name\": \"univention-portal\", \"name\": \"portal\"}],
              \"actor\": {
                \"id\": \"test-user\",
                \"roles\": [{\"app_name\": \"univention-portal\", \"namespace_name\": \"portal\", \"name\": \"authenticated-user\"}],
                \"attributes\": {\"$field\": $value}
              },
              \"extra_request_data\": {},
              \"include_general_permissions\": true
            }" \
        "$GUARDIAN_AUTHORIZATION/permissions")

    # Check in general_permissions (where conditional permissions appear)
    # Use jq to check if permission exists, returns "true" or "false"
    has_permission=$(echo "$result" | jq -r ".general_permissions[]?.name" 2>/dev/null | grep -q "^${expected_permission}$" && echo "yes" || echo "no")

    if [ "$should_have" = "yes" ]; then
        if [ "$has_permission" = "yes" ]; then
            echo "Permission '$expected_permission' granted"
        else
            echo "Permission '$expected_permission' NOT granted (expected to be granted)"
        fi
    else
        if [ "$has_permission" = "no" ]; then
            echo "Permission '$expected_permission' NOT granted"
        else
            echo "Permission '$expected_permission' granted (expected NOT to be granted)"
        fi
    fi
}

echo "*** Ensuring Guardian app and namespace exist ***"

echo "Registering univention-portal app..."
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{"name":"univention-portal", "display_name":"Univention Portal"}' \
    "$GUARDIAN_MANAGEMENT/apps/register" | jq -r '.name // .detail // .message // "ok"'

echo "Creating portal namespace..."
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{"name":"portal", "display_name":"Portal"}' \
    "$GUARDIAN_MANAGEMENT/namespaces/univention-portal" | jq -r '.name // .detail // .message // "ok"'

echo "*** Creating Guardian permissions ***"

create_guardian_permission "view-nextcloud-tile" "View Nextcloud Tile"
create_guardian_permission "view-ox-tile" "View OX Tile"

echo "*** Creating Guardian role ***"

create_guardian_role "authenticated-user" "Authenticated User - Base role for conditional service access"

echo "*** Creating Guardian capabilities with conditions ***"

create_conditional_capability \
    "authenticated-user-can-view-nextcloud-if-enabled" \
    "Authenticated user can view Nextcloud tile if nextcloudEnabled is true" \
    "authenticated-user" \
    "view-nextcloud-tile" \
    "nextcloudEnabled" \
    "true"

create_conditional_capability \
    "authenticated-user-can-view-ox-if-enabled" \
    "Authenticated user can view OX tile if isOxUser is true" \
    "authenticated-user" \
    "view-ox-tile" \
    "isOxUser" \
    "true"

echo "*** Updating tiles with guardianPermissionView ***"

update_tile_guardian_permission "nextcloud" "univention-portal:portal:view-nextcloud-tile"
update_tile_guardian_permission "ox_mail" "univention-portal:portal:view-ox-tile"

echo "*** Assigning authenticated-user role to Domain Users group ***"

assign_role_to_group "$DOMAIN_USERS_DN" "univention-portal:portal:authenticated-user"

echo "*** Testing Guardian conditions ***"

echo ""
echo "Testing Nextcloud conditions:"
test_guardian_condition "nextcloudEnabled=true" "nextcloudEnabled" "true" "view-nextcloud-tile" "yes"
test_guardian_condition "nextcloudEnabled=false" "nextcloudEnabled" "false" "view-nextcloud-tile" "no"

echo "Testing OX conditions:"
test_guardian_condition "isOxUser=true" "isOxUser" "true" "view-ox-tile" "yes"
test_guardian_condition "isOxUser=false" "isOxUser" "false" "view-ox-tile" "no"

echo "=== Setup Complete ==="
echo ""
echo "Created Guardian resources:"
echo "  - Permission: view-nextcloud-tile"
echo "  - Permission: view-ox-tile"
echo "  - Role: authenticated-user"
echo "  - Capability: authenticated-user-can-view-nextcloud-if-enabled"
echo "      Condition: nextcloudEnabled == true"
echo "  - Capability: authenticated-user-can-view-ox-if-enabled"
echo "      Condition: isOxUser == true"
echo ""
echo "Updated tiles:"
echo "  - nextcloud: guardianPermissionView = univention-portal:portal:view-nextcloud-tile"
echo "  - ox_mail: guardianPermissionView = univention-portal:portal:view-ox-tile"
echo ""
echo "Assigned role:"
echo "  - Domain Users group now has guardianMemberRoles: authenticated-user"
echo ""
echo "How it works:"
echo "  1. All users in Domain Users inherit the 'authenticated-user' role"
echo "  2. Guardian evaluates the conditions when checking permissions"
echo "  3. If nextcloudEnabled=true, user gets 'view-nextcloud-tile' permission"
echo "  4. If isOxUser=true, user gets 'view-ox-tile' permission"
echo "  5. Portal shows/hides tiles based on permissions"
echo ""
echo "To enable Nextcloud for a user:"
echo "  curl -X PATCH -H 'Content-Type: application/json' -u '$binduser:<password>' \\"
echo "    -d '{\"properties\": {\"nextcloudEnabled\": true}}' \\"
echo "    '$UDM_API/users/user/<user-dn-encoded>'"
echo ""
echo "To enable OX for a user:"
echo "  curl -X PATCH -H 'Content-Type: application/json' -u '$binduser:<password>' \\"
echo "    -d '{\"properties\": {\"isOxUser\": true}}' \\"
echo "    '$UDM_API/users/user/<user-dn-encoded>'"
