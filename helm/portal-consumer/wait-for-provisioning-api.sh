#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024 Univention GmbH

set -o pipefail

[ -z "$1" ] && {
  echo "A url is required as the first argument"
  exit 1
}

set -uo pipefail

retry_interval=2
response_code=404
timeout_duration=120
end_time=$((SECONDS + timeout_duration))

while [ "$response_code" -ne 200 ]; do
  if [ $SECONDS -ge $end_time ]; then
    echo "Timeout reached. Exiting."
    exit 1
  fi

  echo "Waiting for the Provisioning API to be available ..."
  response_code=$(curl -s -o response.txt -w "%{http_code}" "$@")
  if [ "${response_code}" -ne 200 ]; then
    echo "Provisioning API is not reachable, status code: $response_code"
    cat response.txt
    sleep ${retry_interval}
  else
    echo "The Provisioning API is reachable"
    exit 0
  fi
done

echo "Permanent error ocurred. Exiting."
exit 1
