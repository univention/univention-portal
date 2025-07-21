#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#


from univention.portal import config, get_dynamic_classes
from univention.portal.log import get_logger


logger = get_logger("factory")


def make_arg(arg_definition):
    arg_type = arg_definition["type"]
    if arg_type == "static":
        return arg_definition["value"]
    elif arg_type == "config":
        return config.fetch(arg_definition["key"])
    elif arg_type == "class":
        Klass = get_dynamic_classes(arg_definition["class"])
        args = []
        kwargs = {}
        for _arg_definition in arg_definition.get("args", []):
            args.append(make_arg(_arg_definition))
        for name, _arg_definition in arg_definition.get("kwargs", {}).items():
            logger.debug("Making portals.json kwarg %s", name)
            kwargs[name] = make_arg(_arg_definition)
        return Klass(*args, **kwargs)
    raise TypeError(f"Unknown arg_definition: {arg_definition!r}")


def make_portal(portal_definition):
    logger.debug("Making portals.json portal %s", portal_definition.get("class"))
    return make_arg(portal_definition)
