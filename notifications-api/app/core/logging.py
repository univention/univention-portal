# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

import logging
import os


logger = logging.getLogger(f"{os.getenv('LOGGER', 'gunicorn')}.error")
