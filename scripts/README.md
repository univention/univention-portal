# Portal scripts

This directory contains helper scripts
for setting up and testing the Univention Portal
with the Guardian integration.

[[_TOC_]]

## Scripts

### `guardian-setup.sh`

Sets up the basic Guardian infrastructure for portal tile filtering.

**Usage:**
```bash
./guardian-setup.sh <namespace>
# or source it to export GUARDIAN_TOKEN:
source ./guardian-setup.sh <namespace>
```

**Creates:**
- Registers `univention-portal` app in the Guardian
- Creates `portal` namespace
- Creates `admin-tile-viewer` role
- Creates `view-admin-tiles` permission
- Creates capability linking the role to the permission
- Creates test user `guardian-test` with the role
- Creates the Guardian Tile in the Domain Admin category

---

### `assign-guardian-permission-to-entry.sh`

Assigns a Guardian permission to an existing Tile.

**Usage:**
```bash
./assign-guardian-permission-to-entry.sh <namespace> <entry-name> [permission]
```

**Examples:**
```bash
./assign-guardian-permission-to-entry.sh jconde "keycloak"
./assign-guardian-permission-to-entry.sh jconde "umc" "univention-portal:portal:view-admin-tiles"
```

---

### `create-tiles-and-categories.sh`

Creates a complete test setup with 3 categories and 9 tiles,
each protected by the Guardian permissions.

**Usage:**
```bash
./create-tiles-and-categories.sh <namespace> [ldap-base]
```

**Examples:**
```bash
./create-tiles-and-categories.sh jconde
./create-tiles-and-categories.sh jconde dc=example,dc=com
```

**Creates:**

#### The Guardian resources

| Permission | Role | Capability |
|------------|------|------------|
| `access-service-11` | `tile11-viewer` | `tile11-viewer-can-access-service-11` |
| `access-service-12` | `tile12-viewer` | `tile12-viewer-can-access-service-12` |
| `access-service-13` | `tile13-viewer` | `tile13-viewer-can-access-service-13` |
| `access-service-21` | `tile21-viewer` | `tile21-viewer-can-access-service-21` |
| `access-service-22` | `tile22-viewer` | `tile22-viewer-can-access-service-22` |
| `access-service-23` | `tile23-viewer` | `tile23-viewer-can-access-service-23` |
| `access-service-31` | `tile31-viewer` | `tile31-viewer-can-access-service-31` |
| `access-service-32` | `tile32-viewer` | `tile32-viewer-can-access-service-32` |
| `access-service-33` | `tile33-viewer` | `tile33-viewer-can-access-service-33` |

#### Portal structure

```
domain portal
├── category1
│   ├── tile11 (requires access-service-11)
│   ├── tile12 (requires access-service-12)
│   └── tile13 (requires access-service-13)
├── category2
│   ├── tile21 (requires access-service-21)
│   ├── tile22 (requires access-service-22)
│   └── tile23 (requires access-service-23)
└── category3
    ├── tile31 (requires access-service-31)
    ├── tile32 (requires access-service-32)
    └── tile33 (requires access-service-33)
```

#### How it works

1. Each tile has a `guardianPermissionView` property set to `univention-portal:portal:access-service-XY`
2. Each permission is linked to a role via a capability
3. Users with the role will have the permission granted by Guardian
4. The portal filters tiles based on the user's permissions

#### Granting access to users

To grant a user access to a specific tile, assign them the corresponding role:

```bash
# Example: Grant access to tile11
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianRoles": ["univention-portal:portal:tile11-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"
```

Or assign multiple roles to see multiple tiles:

```bash
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianRoles": ["univention-portal:portal:tile11-viewer", "univention-portal:portal:tile21-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"
```

---

## Useful commands

### Get the Guardian token

```bash
NAMESPACE="jconde"
bindpwd=$(kubectl get secret -n "$NAMESPACE" nubus-nubus-credentials -o jsonpath='{.data.administrator_password}' | base64 -d)

GUARDIAN_TOKEN=$(curl -s \
  -d "client_id=guardian-scripts" \
  -d "username=Administrator" \
  -d "password=$bindpwd" \
  -d "grant_type=password" \
  "https://id.$NAMESPACE.univention.dev/realms/nubus/protocol/openid-connect/token" | jq -r '.access_token')
```

### List the Guardian permissions

```bash
curl -s -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  "https://portal.$NAMESPACE.univention.dev/guardian/management/permissions/univention-portal/portal" | jq .
```

### List the Guardian roles

```bash
curl -s -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  "https://portal.$NAMESPACE.univention.dev/guardian/management/roles/univention-portal/portal" | jq .
```

### List the Guardian capabilities

```bash
curl -s -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  "https://portal.$NAMESPACE.univention.dev/guardian/management/capabilities/univention-portal/portal" | jq .
```

### Check user permissions

```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GUARDIAN_TOKEN" \
  -d '{
    "namespaces": [{"app_name": "univention-portal", "name": "portal"}],
    "actor": {
      "id": "<username>",
      "roles": [{"app_name": "univention-portal", "namespace_name": "portal", "name": "tile11-viewer"}],
      "attributes": {}
    },
    "include_general_permissions": true
  }' \
  "https://portal.$NAMESPACE.univention.dev/guardian/authorization/permissions" | jq .
```
