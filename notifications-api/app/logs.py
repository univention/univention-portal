# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

import logging

from app.core.config import settings


def configure_logging():
    app_logger = logging.getLogger('app')
    app_logger.setLevel(settings.log_level)
    logging.captureWarnings(capture=True)
