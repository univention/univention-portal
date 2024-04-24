#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

set -euxo pipefail

# Ensure that groups and portal data including assets are in the store
univention-portal --log-stream update --reason force
