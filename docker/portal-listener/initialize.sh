#!/bin/bash
set -euxo pipefail

# Ensure that the group membership cache is filled
/usr/share/univention-group-membership-cache/univention-ldap-cache rebuild

# Ensure that groups and portal data including assets are in the store
univention-portal update --reason force
