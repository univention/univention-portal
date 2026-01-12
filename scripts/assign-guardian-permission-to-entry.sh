#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
#
# Assign guardianPermissionView to portal entries
#
# This script assigns the Guardian permission "univention-portal:portal:view-admin-tiles"
# to a specific portal entry, which will make it visible only to users who have
# the admin-tile-viewer role.
#
# Usage: ./assign-guardian-permission-to-entry.sh <namespace> <entry-name> [permission]
#
# Examples:
#   ./assign-guardian-permission-to-entry.sh jconde "keycloak"
#   ./assign-guardian-permission-to-entry.sh jconde "umc" "univention-portal:portal:view-admin-tiles"

set -eo pipefail

NAMESPACE="${1:-}"
ENTRY_NAME="${2:-}"
PERMISSION="${3:-univention-portal:portal:view-admin-tiles}"
LDAP_BASE="${4:-dc=swp-ldap,dc=internal}"

# Configuration
PORTAL_ENTRIES_POSITION="cn=entry,cn=portals,cn=univention,$LDAP_BASE"

if [ -z "$NAMESPACE" ] || [ -z "$ENTRY_NAME" ]; then
    echo "Usage: $0 <namespace> <entry-name> [permission]"
    echo ""
    echo "Examples:"
    echo "  $0 jconde 'keycloak'"
    echo "  $0 jconde 'umc' 'univention-portal:portal:view-admin-tiles'"
    exit 1
fi

echo "=== Assign Guardian Permission to Portal Entry ==="
echo "Namespace: $NAMESPACE"
echo "Entry name: $ENTRY_NAME"
echo "Permission: $PERMISSION"
echo "LDAP Base: $LDAP_BASE"

# Get credentials
binduser="Administrator"
bindpwd=$(kubectl get secret -n "$NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)

UDM_API="https://portal.$NAMESPACE.univention.dev/univention/udm"

# Find the entry DN by name
echo "*** Searching for portal entry '$ENTRY_NAME' ***"

entries_response=$(curl -s \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -u "$binduser:$bindpwd" \
    "$UDM_API/portals/entry/?position=$PORTAL_ENTRIES_POSITION")

# Check there are entries
count=$(echo "$entries_response" | jq '._embedded["udm:object"] | length' 2>/dev/null || echo "0")
if [ "$count" = "0" ] || [ "$count" = "null" ]; then
    echo "ERROR: No portal entries found at position: $PORTAL_ENTRIES_POSITION"
    exit 1
fi

echo "Found $count entries"

# Find entry with matching name
entry_dn=$(echo "$entries_response" | jq -r --arg name "$ENTRY_NAME" '._embedded["udm:object"][] | select(.properties.name == $name) | .dn' | head -1)

if [ -z "$entry_dn" ] || [ "$entry_dn" = "null" ]; then
    echo "ERROR: Could not find portal entry with name '$ENTRY_NAME'"
    echo "Available entries:"
    echo "$entries_response" | jq -r '._embedded["udm:object"][] | "  - \(.properties.name)"' 2>/dev/null || echo "(could not parse)"
    exit 1
fi

echo "Found entry: $entry_dn"

# URL-encode the DN for the API call
entry_dn_encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$entry_dn', safe=''))")

# Get current entry data
echo "*** Current entry data ***"
entry_data=$(curl -s \
    -H "Accept: application/json" \
    -u "$binduser:$bindpwd" \
    "$UDM_API/portals/entry/$entry_dn_encoded")
current_permission=$(echo "$entry_data" | jq -r '.properties.guardianPermissionView // "none"')
echo "Current guardianPermissionView: $current_permission"

# Update the entry with the Guardian permission
echo "*** Updating entry with guardianPermissionView ***"
update_response=$(curl -s -w "\n%{http_code}" -X PATCH \
    -H "Accept: application/json" \
    -H "Content-Type: application/json" \
    -u "$binduser:$bindpwd" \
    -d "{\"properties\": {\"guardianPermissionView\": \"$PERMISSION\"}}" \
    "$UDM_API/portals/entry/$entry_dn_encoded")

http_code=$(echo "$update_response" | tail -n1)
body=$(echo "$update_response" | sed '$d')

if [[ "$http_code" =~ ^2[0-9][0-9]$ ]]; then
    echo "SUCCESS: Updated entry with guardianPermissionView = $PERMISSION"
    echo "*** Verification ***"
    updated_data=$(curl -s \
        -H "Accept: application/json" \
        -u "$binduser:$bindpwd" \
        "$UDM_API/portals/entry/$entry_dn_encoded")
    new_permission=$(echo "$updated_data" | jq -r '.properties.guardianPermissionView // "none"')
    echo "New guardianPermissionView: $new_permission"
else
    echo "ERROR: Failed to update entry (HTTP $http_code)"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    exit 1
fi

echo "=== Done ==="
echo "The portal entry '$ENTRY_NAME' is now protected by Guardian permission: $PERMISSION"
echo "Only users with the role 'univention-portal:portal:admin-tile-viewer' (or other roles"
echo "that grant this permission) will be able to see this tile."
echo "Test users:"
echo "  - guardian-test (has admin-tile-viewer role) -> should see the tile"
echo "  - Other users without the role -> should NOT see the tile"
