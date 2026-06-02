<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# Sample Cerbos request from the simulated portal

The real captured request has massive base64 icons and LDAP metadata
noise. Here's the same shape cleaned up — `student1` plus three
illustrative tiles (`self-service-password-change` unmarked, `ox_mail`
Cerbos-rule-target, `nextcloud` Cerbos-rule-target):

```json
{
  "requestId": "poc",
  "principal": {
    "id": "uid=student1,cn=users,dc=swp-ldap,dc=internal",
    "roles": [
      "univention-portal:portal:authenticated-user"
    ],
    "attr": {
      "username": "student1",
      "firstname": "Student",
      "lastname": "One",
      "displayName": "Student One",
      "mailPrimaryAddress": "student1@guardian-hackathon.univention.dev",
      "groups": [
        "cn=Domain Users,cn=groups,dc=swp-ldap,dc=internal"
      ],
      "primaryGroup": "cn=Domain Users,cn=groups,dc=swp-ldap,dc=internal",
      "guardianRoles": [
        "univention-portal:portal:authenticated-user"
      ],
      "guardianInheritedRoles": [],
      "isOxUser": true,
      "oxAccess": "premium",
      "oxContext": 1,
      "nextcloudEnabled": false,
      "disabled": false,
      "locked": false
    }
  },
  "resources": [
    {
      "actions": ["view"],
      "resource": {
        "kind": "portal:entry",
        "id": "cn=self-service-password-change,cn=entry,cn=portals,cn=univention,dc=swp-ldap,dc=internal",
        "attr": {
          "name": "self-service-password-change",
          "displayName": {
            "en_US": "Change your password",
            "de_DE": "Ihr Passwort ändern"
          },
          "link": [["en_US", "#/selfservice/passwordchange"]],
          "allowedGroups": [
            "cn=Domain Users,cn=groups,dc=swp-ldap,dc=internal"
          ],
          "activated": true,
          "anonymous": false,
          "linkTarget": "samewindow"
        }
      }
    },
    {
      "actions": ["view"],
      "resource": {
        "kind": "portal:entry",
        "id": "cn=ox_mail,cn=entry,cn=portals,cn=univention,dc=swp-ldap,dc=internal",
        "attr": {
          "name": "ox_mail",
          "displayName": {
            "en_US": "Open-Xchange",
            "de_DE": "Open-Xchange"
          },
          "link": [["en_US", "https://ox.example.test/appsuite/#app=io.ox/mail"]],
          "allowedGroups": [
            "cn=Domain Users,cn=groups,dc=swp-ldap,dc=internal"
          ],
          "activated": true,
          "anonymous": false,
          "guardianPermissionView": "univention-portal:portal:view-ox-tile",
          "linkTarget": "newwindow"
        }
      }
    },
    {
      "actions": ["view"],
      "resource": {
        "kind": "portal:entry",
        "id": "cn=nextcloud,cn=entry,cn=portals,cn=univention,dc=swp-ldap,dc=internal",
        "attr": {
          "name": "nextcloud",
          "displayName": {
            "en_US": "Nextcloud",
            "de_DE": "Nextcloud"
          },
          "link": [["en_US", "https://nextcloud.example.test/apps/files"]],
          "allowedGroups": [
            "cn=Domain Admin,cn=groups,dc=swp-ldap,dc=internal",
            "cn=Domain Users,cn=groups,dc=swp-ldap,dc=internal"
          ],
          "activated": true,
          "anonymous": false,
          "guardianPermissionView": "univention-portal:portal:view-nextcloud-tile",
          "backgroundColor": "#ffffff",
          "linkTarget": "newwindow"
        }
      }
    }
  ]
}
```

## What Cerbos returns for this request

```json
{
  "requestId": "poc",
  "results": [
    {
      "resource": {
        "id": "cn=self-service-password-change,...",
        "kind": "portal:entry"
      },
      "actions": { "view": "EFFECT_DENY" }
    },
    {
      "resource": {
        "id": "cn=ox_mail,...",
        "kind": "portal:entry"
      },
      "actions": { "view": "EFFECT_ALLOW" }
    },
    {
      "resource": {
        "id": "cn=nextcloud,...",
        "kind": "portal:entry"
      },
      "actions": { "view": "EFFECT_DENY" }
    }
  ]
}
```

## Reading this

- **`self-service-password-change`**: Cerbos has no rule for this name →
  default DENY. The legacy portal filter handles it via `allowedGroups`
  (student1 is in `Domain Users` → legacy ALLOW). Union: visible.
- **`ox_mail`**: matches rule
  `R.attr.name == "ox_mail" && P.attr.isOxUser == true`.
  student1 has `isOxUser: true` → ALLOW. (Legacy hides it because of the
  `guardianPermissionView` field with Guardian disabled.) Union: visible.
- **`nextcloud`**: matches rule, but `P.attr.nextcloudEnabled` is `false`
  → DENY. Legacy also hides it. Union: invisible.

## Real-world payload size

For the full 33 entries the actual payload is ~95 KB, dominated by base64
SVG icons in each tile. **The portal integration can and should strip
those before sending** — Cerbos has no use for icon bytes. Stripping icons
drops the payload to ~5 KB.
