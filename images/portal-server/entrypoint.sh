#!/bin/sh
set -e

python3 univention-portal update

exec "$@"
