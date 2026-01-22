#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
#
# UCS@school Portal Setup with Guardian Integration
#
# This script creates:
#   - 2 Portal categories: Applications, Documentation
#   - 5 Tiles: Moodle, itslearning LMS Connector, sofatutor, Veyon Proxy, Documentation for Teacher
#   - 5 Guardian permissions (access-moodle, access-itslearning, access-sofatutor, access-veyon, access-documentation)
#   - 5 Guardian roles (one per tile)
#   - 5 Guardian capabilities (linking roles to permissions)
#   - 3 Guardian roles for user types: teacher, student, legal-guardian
#   - 3 Guardian capabilities with multiple permissions for these roles
#   - Icons are loaded from demo/ folder for itslearning, Veyon, and Documentation tiles
#
# Usage: ./ucsschool-setup.sh <k8s-namespace> <domain-fqdn> <ldap-base>
#
# Examples:
#   ./ucsschool-setup.sh jconde portal.jconde.univention.dev dc=example,dc=com
#   ./ucsschool-setup.sh presales-demo portal.nubus-presales-demo.univention.dev dc=school,dc=local
#   ./ucsschool-setup.sh apeicher-nubus-presales-demo portal.nubus-presales-demo.univention.dev dc=swp-ldap,dc=internal

set -eo pipefail

K8S_NAMESPACE="${1:-}"
DOMAIN_FQDN="${2:-}"
LDAP_BASE="${3:-}"

if [ -z "$K8S_NAMESPACE" ] || [ -z "$DOMAIN_FQDN" ] || [ -z "$LDAP_BASE" ]; then
    echo "Usage: $0 <k8s-namespace> <domain-fqdn> <ldap-base>"
    echo ""
    echo "Examples:"
    echo "  $0 jconde portal.jconde.univention.dev dc=example,dc=com"
    echo "  $0 presales-demo portal.nubus-presales-demo.univention.dev dc=school,dc=local"
    echo ""
    echo "Parameters:"
    echo "  k8s-namespace  - Kubernetes namespace where the deployment is running"
    echo "  domain-fqdn    - Full domain name for the portal (e.g., portal.example.com)"
    echo "  ldap-base      - LDAP base DN (e.g., dc=example,dc=com)"
    echo ""
    echo "This script creates UCS@school portal categories, tiles, and Guardian roles."
    exit 1
fi

# Extract base domain from FQDN (remove the first subdomain part)
# e.g., portal.nubus-presales-demo.univention.dev -> nubus-presales-demo.univention.dev
BASE_DOMAIN=$(echo "$DOMAIN_FQDN" | cut -d. -f2-)

echo "=== UCS@school Portal Setup ==="
echo "Kubernetes Namespace: $K8S_NAMESPACE"
echo "Domain FQDN: $DOMAIN_FQDN"
echo "Base Domain: $BASE_DOMAIN"
echo "LDAP Base: $LDAP_BASE"

# Configuration
PORTAL_ENTRIES_POSITION="cn=entry,cn=portals,cn=univention,$LDAP_BASE"
PORTAL_CATEGORIES_POSITION="cn=category,cn=portals,cn=univention,$LDAP_BASE"
PORTAL_DN="cn=domain,cn=portal,cn=portals,cn=univention,$LDAP_BASE"

# Get credentials
binduser="Administrator"
bindpwd=$(kubectl get secret -n "$K8S_NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)
echo "*** Got admin password ***"

# Endpoints
CLIENT_ID="guardian-scripts"
KEYCLOAK_URL="https://id.$BASE_DOMAIN/realms/nubus/protocol/openid-connect/token"
GUARDIAN_MANAGEMENT="https://$DOMAIN_FQDN/guardian/management"
UDM_API="https://$DOMAIN_FQDN/univention/udm"

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
    local display_name_en="$2"
    local display_name_de="$3"
    local description_en="$4"
    local description_de="$5"
    local link="$6"
    local link_target="$7"
    local permission="$8"
    local icon_data="${9:-}"

    echo "  Creating tile: $name (permission: $permission)"

    local icon_json=""
    if [ -n "$icon_data" ]; then
        icon_json=",\"icon\": \"$icon_data\""
    fi

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
                    \"en_US\": \"$display_name_en\",
                    \"de_DE\": \"$display_name_de\"
                },
                \"description\": {
                    \"en_US\": \"$description_en\",
                    \"de_DE\": \"$description_de\"
                },
                \"link\": [[\"en_US\", \"$link\"]],
                \"linkTarget\": \"$link_target\",
                \"guardianPermissionView\": \"$permission\"$icon_json
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

create_or_get_category() {
    local name="$1"
    local display_name_en="$2"
    local display_name_de="$3"
    shift 3
    local entries=("$@")

    echo "  Creating/updating category: $name"

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

    # Try to get existing category
    category_dn="cn=$name,cn=category,cn=portals,cn=univention,$LDAP_BASE"
    category_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$category_dn', safe=''))")

    existing=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Accept: application/json" \
        -u "$binduser:$bindpwd" \
        "$UDM_API/portals/category/$category_dn_encoded")

    if [ "$existing" = "200" ]; then
        echo "    Category exists, updating..."
        response=$(curl -s -w "\n%{http_code}" -X PATCH \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -u "$binduser:$bindpwd" \
            -d "{
                \"properties\": {
                    \"displayName\": {
                        \"en_US\": \"$display_name_en\",
                        \"de_DE\": \"$display_name_de\"
                    },
                    \"entries\": $entries_json
                }
            }" \
            "$UDM_API/portals/category/$category_dn_encoded")
    else
        echo "    Creating new category..."
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Accept: application/json" \
            -H "Content-Type: application/json" \
            -u "$binduser:$bindpwd" \
            -d "{
                \"position\": \"$PORTAL_CATEGORIES_POSITION\",
                \"properties\": {
                    \"name\": \"$name\",
                    \"displayName\": {
                        \"en_US\": \"$display_name_en\",
                        \"de_DE\": \"$display_name_de\"
                    },
                    \"entries\": $entries_json
                }
            }" \
            "$UDM_API/portals/category/")
    fi

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

    echo "*** Updating domain portal with categories ***"

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

# Ensure univention-portal app exists
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

# ============================================================================
# Create Guardian permissions for each tile
# ============================================================================
echo ""
echo "*** Creating Guardian permissions for tiles ***"
create_guardian_permission "access-moodle" "Access Moodle"
create_guardian_permission "access-itslearning" "Access itslearning"
create_guardian_permission "access-sofatutor" "Access sofatutor"
create_guardian_permission "access-veyon" "Access Veyon"
create_guardian_permission "access-documentation" "Access Documentation for Teacher"

# ============================================================================
# Create Guardian roles for each tile
# ============================================================================
echo ""
echo "*** Creating Guardian roles for individual tiles ***"
create_guardian_role "moodle-viewer" "Moodle Viewer"
create_guardian_role "itslearning-viewer" "itslearning Viewer"
create_guardian_role "sofatutor-viewer" "sofatutor Viewer"
create_guardian_role "veyon-viewer" "Veyon Viewer"
create_guardian_role "documentation-viewer" "Documentation Viewer"

# ============================================================================
# Create Guardian capabilities linking tile roles to permissions
# ============================================================================
echo ""
echo "*** Creating Guardian capabilities for individual tile viewers ***"
create_guardian_capability \
    "moodle-viewer-can-access-moodle" \
    "Moodle viewer can access Moodle" \
    "moodle-viewer" \
    "access-moodle"

create_guardian_capability \
    "itslearning-viewer-can-access-itslearning" \
    "itslearning viewer can access itslearning" \
    "itslearning-viewer" \
    "access-itslearning"

create_guardian_capability \
    "sofatutor-viewer-can-access-sofatutor" \
    "sofatutor viewer can access sofatutor" \
    "sofatutor-viewer" \
    "access-sofatutor"

create_guardian_capability \
    "veyon-viewer-can-access-veyon" \
    "Veyon viewer can access Veyon" \
    "veyon-viewer" \
    "access-veyon"

create_guardian_capability \
    "documentation-viewer-can-access-documentation" \
    "Documentation viewer can access Documentation" \
    "documentation-viewer" \
    "access-documentation"

# ============================================================================
# Create Guardian roles for user types (teacher, student, legal-guardian)
# ============================================================================
echo ""
echo "*** Creating Guardian roles for user types ***"
create_guardian_role "teacher" "Teacher - Can see documentation, Moodle, Veyon, and all apps"
create_guardian_role "student" "Student - Can see Moodle, itslearning, sofatutor"
create_guardian_role "legal-guardian" "Legal Guardian - Can see Moodle"

# ============================================================================
# Create Guardian capabilities for user type roles
# ============================================================================
echo ""
echo "*** Creating Guardian capabilities for user type roles ***"

# Teacher: documentation, moodle, veyon, and all apps (moodle, itslearning, sofatutor, veyon)
create_guardian_capability_multi \
    "teacher-can-access-teacher-apps" \
    "Teacher can access documentation, Moodle, Veyon, and all apps" \
    "teacher" \
    "access-documentation" "access-moodle" "access-itslearning" "access-sofatutor" "access-veyon"

# Student: moodle, itslearning, sofatutor
create_guardian_capability_multi \
    "student-can-access-student-apps" \
    "Student can access Moodle, itslearning, sofatutor" \
    "student" \
    "access-moodle" "access-itslearning" "access-sofatutor"

# Legal guardian: moodle only
create_guardian_capability \
    "legal-guardian-can-access-moodle" \
    "Legal guardian can access Moodle" \
    "legal-guardian" \
    "access-moodle"

# ============================================================================
# Read icon files and encode them as base64
# ============================================================================
echo ""
echo "*** Encoding icon files ***"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Documentation icon
DOCUMENTATION_ICON_PATH="$SCRIPT_DIR/../demo/icon-arbeitsgruppen-verwalten.png"
documentation_icon_base64=""
if [ -f "$DOCUMENTATION_ICON_PATH" ]; then
    echo "  Found documentation icon: $DOCUMENTATION_ICON_PATH"
    documentation_icon_base64=$(base64 -w 0 "$DOCUMENTATION_ICON_PATH")
    echo "  Documentation icon encoded (${#documentation_icon_base64} bytes)"
else
    echo "  WARNING: Documentation icon file not found at $DOCUMENTATION_ICON_PATH"
fi

# itslearning icon
ITSLEARNING_ICON_PATH="$SCRIPT_DIR/../demo/itslearning.svg"
itslearning_icon_base64=""
if [ -f "$ITSLEARNING_ICON_PATH" ]; then
    echo "  Found itslearning icon: $ITSLEARNING_ICON_PATH"
    itslearning_icon_base64=$(base64 -w 0 "$ITSLEARNING_ICON_PATH")
    echo "  itslearning icon encoded (${#itslearning_icon_base64} bytes)"
else
    echo "  WARNING: itslearning icon file not found at $ITSLEARNING_ICON_PATH"
fi

# Veyon icon
VEYON_ICON_PATH="$SCRIPT_DIR/../demo/veyon.svg"
veyon_icon_base64=""
if [ -f "$VEYON_ICON_PATH" ]; then
    echo "  Found Veyon icon: $VEYON_ICON_PATH"
    veyon_icon_base64=$(base64 -w 0 "$VEYON_ICON_PATH")
    echo "  Veyon icon encoded (${#veyon_icon_base64} bytes)"
else
    echo "  WARNING: Veyon icon file not found at $VEYON_ICON_PATH"
fi

# ============================================================================
# Create portal entries (tiles)
# ============================================================================
echo ""
echo "*** Creating portal entries (tiles) ***"

# Application tiles
create_portal_entry \
    "moodle" \
    "Moodle" \
    "Moodle" \
    "Moodle Learning Platform" \
    "Moodle Lernplattform" \
    "https://moodle.example.com" \
    "newwindow" \
    "univention-portal:portal:access-moodle"

create_portal_entry \
    "itslearning" \
    "itslearning LMS Connector" \
    "itslearning LMS Connector" \
    "itslearning Learning Management System Connector" \
    "itslearning Lernmanagementsystem-Connector" \
    "https://itslearning.example.com" \
    "newwindow" \
    "univention-portal:portal:access-itslearning" \
    "$itslearning_icon_base64"

create_portal_entry \
    "sofatutor" \
    "sofatutor" \
    "sofatutor" \
    "sofatutor Online Learning" \
    "sofatutor Online-Lernen" \
    "https://sofatutor.example.com" \
    "newwindow" \
    "univention-portal:portal:access-sofatutor"

create_portal_entry \
    "veyon" \
    "Veyon Proxy" \
    "Veyon Proxy" \
    "Veyon Classroom Management Proxy" \
    "Veyon Klassenraumverwaltungs-Proxy" \
    "https://veyon.example.com" \
    "newwindow" \
    "univention-portal:portal:access-veyon" \
    "$veyon_icon_base64"

# Documentation tile (with icon if available)
create_portal_entry \
    "teacher-documentation" \
    "Documentation for Teacher" \
    "Dokumentation für Lehrkräfte" \
    "UCS@school Documentation for Teachers" \
    "UCS@school Dokumentation für Lehrkräfte" \
    "https://docs.software-univention.de/ucsschool-teachers/latest/de/index.html" \
    "newwindow" \
    "univention-portal:portal:access-documentation" \
    "$documentation_icon_base64"

# ============================================================================
# Create portal categories
# ============================================================================
echo ""
echo "*** Creating portal categories ***"

# Check if Applications category already exists
applications_dn="cn=service,cn=category,cn=portals,cn=univention,$LDAP_BASE"
applications_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$applications_dn', safe=''))")

existing_applications=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Accept: application/json" \
    -u "$binduser:$bindpwd" \
    "$UDM_API/portals/category/$applications_dn_encoded")

if [ "$existing_applications" = "200" ]; then
    echo "  Applications category (service) already exists, adding tiles to it..."

    # Get current entries
    current_data=$(curl -s \
        -H "Accept: application/json" \
        -u "$binduser:$bindpwd" \
        "$UDM_API/portals/category/$applications_dn_encoded")

    current_entries=$(echo "$current_data" | jq -r '.properties.entries // []')

    # Add new tiles
    for tile in "moodle" "itslearning" "sofatutor" "veyon"; do
        tile_dn="cn=$tile,cn=entry,cn=portals,cn=univention,$LDAP_BASE"
        if ! echo "$current_entries" | jq -e ".[] | select(. == \"$tile_dn\")" > /dev/null 2>&1; then
            current_entries=$(echo "$current_entries" | jq ". + [\"$tile_dn\"]")
        fi
    done

    # Update category
    response=$(curl -s -w "\n%{http_code}" -X PATCH \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -u "$binduser:$bindpwd" \
        -d "{\"properties\": {\"entries\": $current_entries}}" \
        "$UDM_API/portals/category/$applications_dn_encoded")

    http_code=$(echo "$response" | tail -n1)
    if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        echo "    OK - Added tiles to Applications category"
    else
        echo "    WARN: HTTP $http_code"
    fi
else
    echo "  Applications category does not exist, creating as 'applications'..."
    create_or_get_category "applications" "Applications" "Anwendungen" "moodle" "itslearning" "sofatutor" "veyon"
fi

# Create Documentation category
create_or_get_category "documentation" "Documentation" "Dokumentation" "teacher-documentation"

# ============================================================================
# Update domain portal with new categories
# ============================================================================
echo ""
if [ "$existing_applications" = "200" ]; then
    # Applications category already exists, only add Documentation
    update_portal_categories "$PORTAL_DN" "documentation"
else
    # Add both categories
    update_portal_categories "$PORTAL_DN" "applications" "documentation"
fi

# ============================================================================
# Summary
# ============================================================================

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Created Portal Structure:"
echo "  Categories:"
echo "    - Applications (or added to existing 'service' category): Moodle, itslearning LMS Connector, sofatutor, Veyon Proxy"
echo "    - Documentation: Documentation for Teacher"
echo ""
echo "  Tiles:"
echo "    - moodle (permission: access-moodle)"
echo "    - itslearning → 'itslearning LMS Connector' (permission: access-itslearning, with icon)"
echo "    - sofatutor (permission: access-sofatutor)"
echo "    - veyon → 'Veyon Proxy' (permission: access-veyon, with icon)"
echo "    - teacher-documentation → 'Documentation for Teacher' (permission: access-documentation, with icon)"
echo ""
echo "Created Guardian Structure:"
echo "  Individual Tile Roles:"
echo "    - moodle-viewer → grants access-moodle"
echo "    - itslearning-viewer → grants access-itslearning"
echo "    - sofatutor-viewer → grants access-sofatutor"
echo "    - veyon-viewer → grants access-veyon"
echo "    - documentation-viewer → grants access-documentation"
echo ""
echo "  User Type Roles:"
echo "    - teacher → grants: access-documentation, access-moodle, access-itslearning, access-sofatutor, access-veyon"
echo "    - student → grants: access-moodle, access-itslearning, access-sofatutor"
echo "    - legal-guardian → grants: access-moodle"
echo ""
echo "To assign roles to users:"
echo ""
echo "# Assign teacher role to a user:"
echo "curl -X PATCH -H \"Content-Type: application/json\" -u \"Administrator:<password>\" \\"
echo "  -d '{\"properties\": {\"guardianRoles\": [\"univention-portal:portal:teacher\"]}}' \\"
echo "  \"$UDM_API/users/user/<user-dn-encoded>\""
echo ""
echo "# Assign student role to a user:"
echo "curl -X PATCH -H \"Content-Type: application/json\" -u \"Administrator:<password>\" \\"
echo "  -d '{\"properties\": {\"guardianRoles\": [\"univention-portal:portal:student\"]}}' \\"
echo "  \"$UDM_API/users/user/<user-dn-encoded>\""
echo ""
echo "# Assign legal-guardian role to a user:"
echo "curl -X PATCH -H \"Content-Type: application/json\" -u \"Administrator:<password>\" \\"
echo "  -d '{\"properties\": {\"guardianRoles\": [\"univention-portal:portal:legal-guardian\"]}}' \\"
echo "  \"$UDM_API/users/user/<user-dn-encoded>\""
echo ""
echo "# Or assign to groups using guardianMemberRoles:"
echo "curl -X PATCH -H \"Content-Type: application/json\" -u \"Administrator:<password>\" \\"
echo "  -d '{\"properties\": {\"guardianMemberRoles\": [\"univention-portal:portal:teacher\"]}}' \\"
echo "  \"$UDM_API/groups/group/<group-dn-encoded>\""
echo ""
echo "# View Guardian resources:"
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/permissions/univention-portal/portal | jq ."
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/roles/univention-portal/portal | jq ."
echo "curl -s -H \"Authorization: Bearer \$GUARDIAN_TOKEN\" $GUARDIAN_MANAGEMENT/capabilities/univention-portal/portal | jq ."
