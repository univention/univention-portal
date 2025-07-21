#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only


import json
from glob import glob

from .log import get_logger


# TODO: Planned refactoring of the configuration processing
#
# We aim to add validation around the configuration based on Pydantic, so that
# there is protection against wrong types in the configuration file. Together
# with this change the load of the configuration shall be triggered from
# `main:run_server` instead of being done on-demand. Together with the Pydantic
# based configuration model we want to also add initial log output of the
# configuration, assuming that Pydantic's support for sensitive values will
# help to ensure that there is no accidental logging of sensitive information.


logger = get_logger("config")

_CONF = "/usr/lib/univention-portal/config/*.json"
_DB = {}


def load():
    _DB.clear()
    try:
        for fname in sorted(glob(_CONF)):
            with open(fname) as fd:
                _DB.update(json.load(fd))
    except EnvironmentError:
        pass
    else:
        load.never_loaded = False
        _log_configuration()


load.never_loaded = True


def fetch(key):
    if load.never_loaded:
        load()
    return _DB[key]


def fetch_with_default(key, *, default):
    try:
        return fetch(key)
    except KeyError:
        return default


def _log_configuration():
    logger.info("Feature toggles: %s", fetch_with_default("feature_toggles", default={}))
