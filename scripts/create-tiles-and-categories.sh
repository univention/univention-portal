#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
#
# Create test tiles and categories for Guardian permission testing
#
# This script creates:
#   - 9 Guardian permissions (accessService11, accessService12, ..., accessService33)
#   - 9 Guardian roles (tile11-viewer, tile12-viewer, ..., tile33-viewer)
#   - 9 Guardian capabilities (linking roles to permissions)
#   - 9 portal tiles (tile11, tile12, ..., tile33) with guardianPermissionView
#   - 3 portal categories (category1, category2, category3)
#   - Updates the domain portal to include the new categories
#
# Usage: ./create-tiles-and-categories.sh <namespace> [ldap-base]
#
# Examples:
#   ./create-tiles-and-categories.sh jconde
#   ./create-tiles-and-categories.sh jconde dc=example,dc=com

set -eo pipefail

NAMESPACE="${1:-}"
LDAP_BASE="${2:-dc=swp-ldap,dc=internal}"

if [ -z "$NAMESPACE" ]; then
    echo "Usage: $0 <namespace> [ldap-base]"
    echo ""
    echo "Examples:"
    echo "  $0 jconde"
    echo "  $0 jconde dc=example,dc=com"
    echo ""
    echo "This script creates 3 categories with 3 tiles each, all protected by Guardian permissions."
    exit 1
fi

echo "=== Create Tiles and Categories for namespace: $NAMESPACE ==="
echo "LDAP Base: $LDAP_BASE"

# Configuration
PORTAL_ENTRIES_POSITION="cn=entry,cn=portals,cn=univention,$LDAP_BASE"
PORTAL_CATEGORIES_POSITION="cn=category,cn=portals,cn=univention,$LDAP_BASE"
PORTAL_DN="cn=domain,cn=portal,cn=portals,cn=univention,$LDAP_BASE"

# Get credentials
binduser="Administrator"
bindpwd=$(kubectl get secret -n "$NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)
echo "*** Got admin password ***"

# Endpoints
CLIENT_ID="guardian-scripts"
KEYCLOAK_URL="https://id.$NAMESPACE.univention.dev/realms/nubus/protocol/openid-connect/token"
GUARDIAN_MANAGEMENT="https://portal.$NAMESPACE.univention.dev/guardian/management"
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

# ============================================================================
# Helper functions
# ============================================================================

create_guardian_permission() {
    local name="$1"
    local display_name="$2"
    echo "  Creating permission: $name"
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"name\":\"$name\", \"display_name\":\"$display_name\"}" \
        "$GUARDIAN_MANAGEMENT/permissions/univention-portal/portal" | jq -r '.name // .detail // "created"'
}

create_guardian_role() {
    local name="$1"
    local display_name="$2"
    echo "  Creating role: $name"
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"name\":\"$name\", \"display_name\":\"$display_name\"}" \
        "$GUARDIAN_MANAGEMENT/roles/univention-portal/portal" | jq -r '.name // .detail // "created"'
}

create_guardian_capability() {
    local name="$1"
    local display_name="$2"
    local role_name="$3"
    local permission_name="$4"
    echo "  Creating capability: $name"
    curl -s -X POST \
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
              \"conditions\": [],
              \"relation\": \"AND\",
              \"permissions\": [
                {
                  \"app_name\": \"univention-portal\",
                  \"namespace_name\": \"portal\",
                  \"name\": \"$permission_name\"
                }
              ]
            }" \
        "$GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal" | jq -r '.name // .detail // "created"'
}

create_guardian_capability_multi() {
    # Creates a capability with multiple permissions
    # Usage: create_guardian_capability_multi <name> <display_name> <role_name> <perm1> <perm2> [perm3...]
    local name="$1"
    local display_name="$2"
    local role_name="$3"
    shift 3
    local permissions=("$@")

    echo "  Creating capability: $name (${#permissions[@]} permissions)"

    # Build permissions array JSON
    local perms_json="["
    local first=true
    for perm in "${permissions[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            perms_json+=","
        fi
        perms_json+="{\"app_name\":\"univention-portal\",\"namespace_name\":\"portal\",\"name\":\"$perm\"}"
    done
    perms_json+="]"

    curl -s -X POST \
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
              \"conditions\": [],
              \"relation\": \"AND\",
              \"permissions\": $perms_json
            }" \
        "$GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal" | jq -r '.name // .detail // "created"'
}

create_portal_entry() {
    local name="$1"
    local display_name="$2"
    local permission="$3"
    echo "  Creating tile: $name (permission: $permission)"

    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{
            \"position\": \"$PORTAL_ENTRIES_POSITION\",
            \"properties\": {
                \"name\": \"$name\",
                \"activated\": true,
                \"anonymous\": false,
                \"displayName\": {
                    \"en_US\": \"$display_name\",
                    \"de_DE\": \"$display_name\"
                },
                \"description\": {
                    \"en_US\": \"Test tile $display_name\",
                    \"de_DE\": \"Test-Kachel $display_name\"
                },
                \"link\": [[\"en_US\", \"#\"]],
                \"linkTarget\": \"samewindow\",
                \"guardianPermissionView\": \"$permission\"
            }
        }" \
        "$UDM_API/portals/entry/")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "    OK (HTTP $http_code)"
    else
        echo "    WARN: HTTP $http_code - $(echo "$body" | jq -r '.error.message // .title // "unknown error"' 2>/dev/null || echo "$body")"
    fi
}

create_portal_category() {
    local name="$1"
    local display_name="$2"
    shift 2
    local entries=("$@")

    echo "  Creating category: $name"

    # Build entries array JSON
    local entries_json="["
    local first=true
    for entry in "${entries[@]}"; do
        if [ "$first" = true ]; then
            first=false
        else
            entries_json+=","
        fi
        entries_json+="\"cn=$entry,cn=entry,cn=portals,cn=univention,$LDAP_BASE\""
    done
    entries_json+="]"

    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{
            \"position\": \"$PORTAL_CATEGORIES_POSITION\",
            \"properties\": {
                \"name\": \"$name\",
                \"displayName\": {
                    \"en_US\": \"$display_name\",
                    \"de_DE\": \"$display_name\"
                },
                \"entries\": $entries_json
            }
        }" \
        "$UDM_API/portals/category/")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "    OK (HTTP $http_code)"
    else
        echo "    WARN: HTTP $http_code - $(echo "$body" | jq -r '.error.message // .title // "unknown error"' 2>/dev/null || echo "$body")"
    fi
}

update_portal_categories() {
    local portal_dn="$1"
    shift
    local new_categories=("$@")

    echo "*** Updating domain portal with new categories ***"

    # URL-encode the portal DN
    portal_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$portal_dn', safe=''))")

    # Get current portal data
    portal_data=$(curl -s \
        -H "Accept: application/json" \
        -u "$binduser:$bindpwd" \
        "$UDM_API/portals/portal/$portal_dn_encoded")

    # Extract current categories
    current_categories=$(echo "$portal_data" | jq -r '.properties.categories // []')

    # Build new categories list (append new ones)
    for cat in "${new_categories[@]}"; do
        cat_dn="cn=$cat,cn=category,cn=portals,cn=univention,$LDAP_BASE"
        # Check if already in list
        if ! echo "$current_categories" | jq -e ".[] | select(. == \"$cat_dn\")" > /dev/null 2>&1; then
            current_categories=$(echo "$current_categories" | jq ". + [\"$cat_dn\"]")
        fi
    done

    # Update portal
    response=$(curl -s -w "\n%{http_code}" -X PATCH \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{\"properties\": {\"categories\": $current_categories}}" \
        "$UDM_API/portals/portal/$portal_dn_encoded")

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "  OK - Portal updated with categories: ${new_categories[*]}"
    else
        echo "  ERROR: HTTP $http_code"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
}

# ============================================================================
# Main script
# ============================================================================

# Ensure univention-portal app exists (may already exist from guardian-setup.sh)
echo "*** Ensuring univention-portal app is registered ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{"name":"univention-portal", "display_name":"Univention Portal"}' \
    "$GUARDIAN_MANAGEMENT/apps/register" | jq -r '.name // .detail // "ok"'

# Ensure portal namespace exists
echo "*** Ensuring portal namespace exists ***"
curl -s -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{"name":"portal", "display_name":"Portal"}' \
    "$GUARDIAN_MANAGEMENT/namespaces/univention-portal" | jq -r '.name // .detail // "ok"'

# Create Guardian permissions
echo ""
echo "*** Creating Guardian permissions ***"
for cat in 1 2 3; do
    for tile in 1 2 3; do
        create_guardian_permission "access-service-${cat}${tile}" "Access Service ${cat}${tile}"
    done
done

# Create Guardian roles
echo ""
echo "*** Creating Guardian roles ***"
for cat in 1 2 3; do
    for tile in 1 2 3; do
        create_guardian_role "tile${cat}${tile}-viewer" "Tile ${cat}${tile} Viewer"
    done
done

# Create category-level viewer roles (grants access to all tiles in a category)
echo ""
echo "*** Creating category viewer roles ***"
for cat in 1 2 3; do
    create_guardian_role "category${cat}-viewer" "Category ${cat} Viewer - Can see all tiles in Category ${cat}"
done

# Create Guardian capabilities (link roles to permissions)
echo ""
echo "*** Creating Guardian capabilities for individual tile viewers ***"
for cat in 1 2 3; do
    for tile in 1 2 3; do
        create_guardian_capability \
            "tile${cat}${tile}-viewer-can-access-service-${cat}${tile}" \
            "Tile ${cat}${tile} viewer can access service ${cat}${tile}" \
            "tile${cat}${tile}-viewer" \
            "access-service-${cat}${tile}"
    done
done

# Create Guardian capabilities for category viewers (link category roles to all permissions in that category)
echo ""
echo "*** Creating Guardian capabilities for category viewers ***"
for cat in 1 2 3; do
    create_guardian_capability_multi \
        "category${cat}-viewer-can-access-all-category${cat}-services" \
        "Category ${cat} viewer can access all services in category ${cat}" \
        "category${cat}-viewer" \
        "access-service-${cat}1" "access-service-${cat}2" "access-service-${cat}3"
done

# Create portal entries (tiles)
echo ""
echo "*** Creating portal entries (tiles) ***"
for cat in 1 2 3; do
    for tile in 1 2 3; do
        create_portal_entry \
            "tile${cat}${tile}" \
            "Tile ${cat}${tile}" \
            "univention-portal:portal:access-service-${cat}${tile}"
    done
done

# Create portal categories
echo ""
echo "*** Creating portal categories ***"
create_portal_category "category1" "Category 1" "tile11" "tile12" "tile13"
create_portal_category "category2" "Category 2" "tile21" "tile22" "tile23"
create_portal_category "category3" "Category 3" "tile31" "tile32" "tile33"

# Update domain portal with new categories
echo ""
update_portal_categories "$PORTAL_DN" "category1" "category2" "category3"

# ============================================================================
# Summary
# ============================================================================

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Created:"
echo "  - 9 Guardian permissions: access-service-11, access-service-12, ..., access-service-33"
echo "  - 12 Guardian roles:"
echo "      - 9 tile viewer roles: tile11-viewer, tile12-viewer, ..., tile33-viewer"
echo "      - 3 category viewer roles: category1-viewer, category2-viewer, category3-viewer"
echo "  - 12 Guardian capabilities linking roles to permissions"
echo "  - 9 Portal tiles: tile11, tile12, ..., tile33"
echo "  - 3 Portal categories: category1, category2, category3"
echo ""
echo "Each tile is protected by its corresponding Guardian permission."
echo "For example:"
echo "  - tile11 requires permission: univention-portal:portal:access-service-11"
echo "  - tile23 requires permission: univention-portal:portal:access-service-23"
echo ""
echo "Role Types:"
echo "  1. Individual tile roles - Grant access to a single tile"
echo "     Example: tile11-viewer grants access to tile11 only"
echo ""
echo "  2. Category viewer roles - Grant access to ALL tiles in a category"
echo "     Example: category1-viewer grants access to tile11, tile12, and tile13"
echo ""
echo "To grant a user access to a tile, assign them the corresponding role."
echo "Example: To let a user see tile11, assign role 'univention-portal:portal:tile11-viewer'"
echo "Example: To let a user see all of category 1, assign role 'univention-portal:portal:category1-viewer'"
echo ""
echo "# Useful commands:"
echo "# List permissions:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/permissions/univention-portal/portal | jq ."
echo ""
echo "# List roles:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/roles/univention-portal/portal | jq ."
echo ""
echo "# Assign role to user via UDM (example for tile11-viewer):"
echo "curl -X PATCH -H \"Content-Type: application/json\" -u \"$binduser:<password>\" \\"
echo "  -d '{\"properties\": {\"guardianRoles\": [\"univention-portal:portal:tile11-viewer\"]}}' \\"
echo "  \"$UDM_API/users/user/<user-dn-encoded>\""
