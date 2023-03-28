#!/bin/bash
set -euo pipefail

# require environment variables to be set
if [[ -z "${LDAP_SERVER:-}" ]]; then
  echo "Please set the environment variable LDAP_SERVER"
  exit 126
fi

if [[ -z "${LDAP_SECRET:-}" ]]; then
  echo "Please set the environment variable LDAP_SECRET"
  exit 126
fi

if [[ -z "${LDAP_BASE:-}" ]]; then
  echo "Please set the environment variable LDAP_BASE"
  exit 126
fi

if [ ! -d /opt/keycloak/data/h2 ]; then
    # Keycloak has not run before.
    # Prepare realm import.
    mkdir --parents /opt/keycloak/data/import
    jq  " \
          .components.\"org.keycloak.storage.UserStorageProvider\"[0].config.bindDn = [\"uid=sys-idp-user,cn=users,$LDAP_BASE\"] \
        | .components.\"org.keycloak.storage.UserStorageProvider\"[0].config.bindCredential = [\"$LDAP_SECRET\"] \
        | .components.\"org.keycloak.storage.UserStorageProvider\"[0].config.connectionUrl = [\"$LDAP_SERVER\"] \
        | .components.\"org.keycloak.storage.UserStorageProvider\"[0].config.usersDn = [\"$LDAP_BASE\"] \
        " \
        /opt/keycloak/realm-export.json \
        > /opt/keycloak/data/import/realm-import.json
else
    # Keycloak has run before.
    # Remove realm import, so that it does not overwrite custom settings.
    rm -rf /opt/keycloak/data/import
fi

exec "$@"
