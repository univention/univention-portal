#!/bin/bash
set -euxo pipefail

ln --symbolic --force "/run/secrets/machine_secret" "/etc/machine.secret"

exec "$@"
