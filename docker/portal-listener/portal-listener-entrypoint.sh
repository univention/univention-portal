#!/bin/bash
set -euxo pipefail

ln --symbolic --force "${MACHINE_SECRET_FILE:-/run/secrets/machine_secret}" "/etc/machine.secret"

if [ ! -e /etc/machine.secret ]
then
    echo "ERROR: MACHINE_SECRET_FILE is not set correctly."
    exit 1
fi

exec "$@"
