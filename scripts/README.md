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

**Individual tile roles** - Each grants access to a single tile:

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

**Category viewer roles** - Each grants access to ALL tiles in a category:

| Role | Grants Permissions | Capability |
|------|-------------------|------------|
| `category1-viewer` | `access-service-11`, `access-service-12`, `access-service-13` | `category1-viewer-can-access-all-category1-services` |
| `category2-viewer` | `access-service-21`, `access-service-22`, `access-service-23` | `category2-viewer-can-access-all-category2-services` |
| `category3-viewer` | `access-service-31`, `access-service-32`, `access-service-33` | `category3-viewer-can-access-all-category3-services` |

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
# Example: Grant access to tile11 only
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianRoles": ["univention-portal:portal:tile11-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"
```

Or assign a category viewer role to see all tiles in that category:

```bash
# Example: Grant access to ALL tiles in category 1 (tile11, tile12, tile13)
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianRoles": ["univention-portal:portal:category1-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"
```

Or assign multiple roles to see multiple tiles:

```bash
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianRoles": ["univention-portal:portal:tile11-viewer", "univention-portal:portal:tile21-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"
```

You can also assign roles to groups using `guardianMemberRoles`:

```bash
# Example: Grant all members of a group access to category 2
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"guardianMemberRoles": ["univention-portal:portal:category2-viewer"]}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/groups/group/<group-dn-encoded>"
```

---

### `setup-conditional-service-tiles.sh`

Configures Nextcloud and OX tiles to be shown/hidden based on user attributes
(`nextcloudEnabled`, `isOxUser`) using Guardian conditions.

**Usage:**
```bash
./setup-conditional-service-tiles.sh <namespace> [ldap-base]
```

**Examples:**
```bash
./setup-conditional-service-tiles.sh jconde
./setup-conditional-service-tiles.sh jconde dc=example,dc=com
```

**Creates:**

| Resource | Name | Purpose |
|----------|------|---------|
| Permission | `view-nextcloud-tile` | Required to see Nextcloud tile |
| Permission | `view-ox-tile` | Required to see OX tile |
| Role | `authenticated-user` | Base role for conditional access |
| Capability | `authenticated-user-can-view-nextcloud-if-enabled` | Grants permission if `nextcloudEnabled == true` |
| Capability | `authenticated-user-can-view-ox-if-enabled` | Grants permission if `isOxUser == true` |

**Updates existing tiles:**
- `nextcloud` → sets `guardianPermissionView: univention-portal:portal:view-nextcloud-tile`
- `ox_mail` → sets `guardianPermissionView: univention-portal:portal:view-ox-tile`

**Assigns role:**
- Adds `authenticated-user` to `Domain Users` group's `guardianMemberRoles`

#### How it works

```
User logs in
    ↓
Portal fetches user from UDM (includes nextcloudEnabled, isOxUser)
    ↓
User inherits "authenticated-user" role from Domain Users group
    ↓
Guardian evaluates conditions:
    - If nextcloudEnabled=true → grant "view-nextcloud-tile"
    - If isOxUser=true → grant "view-ox-tile"
    ↓
Portal shows/hides tiles based on permissions
```

#### Enabling services for users

No role assignment needed! Just set the user attribute:

```bash
# Enable Nextcloud for a user
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"nextcloudEnabled": true}}' \
  "https://portal.<namespace>.univention.dev/univention/udm/users/user/<user-dn-encoded>"

# Enable OX for a user
curl -X PATCH -H "Content-Type: application/json" -u "Administrator:<password>" \
  -d '{"properties": {"isOxUser": true}}' \
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
