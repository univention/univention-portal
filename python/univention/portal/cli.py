# Copyright 2020-2024 Univention GmbH
#
# https://www.univention.de/
#
# All rights reserved.
#
# The source code of this program is made available
# under the terms of the GNU Affero General Public License version 3
# (GNU AGPL V3) as published by the Free Software Foundation.
#
# Binary versions of this program provided by Univention to you as
# well as other copyrighted, protected or trademarked materials like
# Logos, graphics, fonts, specific documentations and configurations,
# cryptographic keys etc. are subject to a license agreement between
# you and Univention and not subject to the GNU AGPL V3.
#
# In the case you use this program under the terms of the GNU AGPL V3,
# the program is provided in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public
# License with the Debian GNU/Linux or Univention distribution in file
# /usr/share/common-licenses/AGPL-3; if not, see
# <https://www.gnu.org/licenses/>.

import ast
import datetime
import json
import os
from inspect import getfullargspec
from tempfile import NamedTemporaryFile
from textwrap import dedent
from typing import Dict, List, Union

import click

from . import get_all_dynamic_classes, get_dynamic_classes
from .config import fetch as config_fetch
from .factory import make_portal
from .log import get_logger


logger = get_logger("cli")
portals_json = "/usr/share/univention-portal/portals.json"
_silent = False


def silence_click():
    global _silent
    _silent = True


def read_portals_json() -> Dict:
    try:
        with open(portals_json) as fd:
            return json.load(fd)
    except EnvironmentError as exc:
        warn(f"Exception {exc} while trying to load {portals_json}")
        return {}


def write_portals_json(content: Dict):
    with NamedTemporaryFile(mode="w", prefix=os.path.basename(portals_json), dir=os.path.dirname(portals_json), delete=False) as tmp:
        try:
            os.chmod(tmp.name, 0o660)
            json.dump(content, tmp, sort_keys=True, indent=4)
            tmp.flush()
            os.rename(tmp.name, portals_json)
        except OSError:
            os.unlink(tmp.name)
            raise


def add_default(update: bool = False):
    changed = False
    json_content = read_portals_json()

    # /univention/portal/
    default_name = "default"
    if default_name in json_content:
        if update:
            warn(f"Overwriting existing {default_name}")
            _add_default(default_name, json_content)
            changed = True
        else:
            info(f"{default_name} already exists")
    else:
        _add_default(default_name, json_content)
        changed = True

    if changed:
        write_portals_json(json_content)
        success(f"{portals_json} written")


def add_umc_default(update: bool = False):
    changed = False
    json_content = read_portals_json()

    # /univention/umc/
    umc_name = "umc"
    if umc_name in json_content:
        if update:
            warn(f"Overwriting existing {umc_name}")
            _add_umc(umc_name, json_content)
            changed = True
        else:
            info(f"{umc_name} already exists")
    else:
        _add_umc(umc_name, json_content)
        changed = True

    if changed:
        write_portals_json(json_content)
        success(f"{portals_json} written")


def add_selfservice_default(update: bool = False):
    changed = False
    json_content = read_portals_json()

    # /univention/selfservice/
    selfservice_name = "selfservice"
    if selfservice_name in json_content:
        if update:
            warn(f"Overwriting existing {selfservice_name}")
            _add_selfservice(selfservice_name, json_content)
            changed = True
        else:
            info(f"{selfservice_name} already exists")
    else:
        _add_selfservice(selfservice_name, json_content)
        changed = True

    if changed:
        write_portals_json(json_content)
        success(f"{portals_json} written")


def _add_default(name: str, json_content: Dict):
    portal_def = {
        "class": "Portal",
        "kwargs": {
            "authenticator": {
                "class": "UMCAuthenticator",
                "kwargs": {
                    "group_cache": {
                        "class": "GroupFileCache",
                        "kwargs": {
                            "cache_file": {
                                "type": "static",
                                "value": "/var/cache/univention-portal/groups.json",
                            },
                            "reloader": {
                                "class": "GroupsReloaderLDAP",
                                "kwargs": {
                                    "binddn": {"key": "hostdn", "type": "config"},
                                    "cache_file": {
                                        "type": "static",
                                        "value": "/var/cache/univention-portal/groups.json",
                                    },
                                    "ldap_base": {"key": "ldap_base", "type": "config"},
                                    "ldap_uri": {"key": "ldap_uri", "type": "config"},
                                    "password_file": {
                                        "type": "static",
                                        "value": "/etc/machine.secret",
                                    },
                                },
                                "type": "class",
                            },
                        },
                        "type": "class",
                    },
                    "umc_session_url": {"key": "umc_session_url", "type": "config"},
                    "auth_mode": {"key": "auth_mode", "type": "config"},
                },
                "type": "class",
            },
            "portal_cache": {
                "class": "PortalFileCache",
                "kwargs": {
                    "cache_file": {
                        "type": "static",
                        "value": "/var/cache/univention-portal/portal.json",
                    },
                    "reloader": {
                        "class": "PortalReloaderUDM",
                        "kwargs": {
                            "cache_file": {
                                "type": "static",
                                "value": "/var/cache/univention-portal/portal.json",
                            },
                            "portal_dn": {"key": "default_domain_dn", "type": "config"},
                        },
                        "type": "class",
                    },
                },
                "type": "class",
            },
            "scorer": {"class": "Scorer", "type": "class"},
        },
        "type": "class",
    }
    json_content[name] = portal_def


def _add_umc(name: str, json_content: Dict):
    portal_def = {
        "class": "UMCPortal",
        "kwargs": {
            "authenticator": {
                "class": "UMCAuthenticator",
                "kwargs": {
                    "group_cache": {
                        "class": "GroupFileCache",
                        "kwargs": {
                            "cache_file": {
                                "type": "static",
                                "value": "/var/cache/univention-portal/groups.json",
                            },
                            "reloader": {
                                "class": "GroupsReloaderLDAP",
                                "kwargs": {
                                    "binddn": {"key": "hostdn", "type": "config"},
                                    "cache_file": {
                                        "type": "static",
                                        "value": "/var/cache/univention-portal/groups.json",
                                    },
                                    "ldap_base": {"key": "ldap_base", "type": "config"},
                                    "ldap_uri": {"key": "ldap_uri", "type": "config"},
                                    "password_file": {
                                        "type": "static",
                                        "value": "/etc/machine.secret",
                                    },
                                },
                                "type": "class",
                            },
                        },
                        "type": "class",
                    },
                    "umc_session_url": {"key": "umc_session_url", "type": "config"},
                    "auth_mode": {"key": "auth_mode", "type": "config"},
                },
                "type": "class",
            },
            "scorer": {
                "class": "PathScorer",
                "kwargs": {
                    "path": {"value": "/univention/umc", "type": "static"},
                    "fallback_score": {"value": 0.5, "type": "static"},
                },
                "type": "class"},
        },
        "type": "class",
    }
    json_content[name] = portal_def


def _add_selfservice(name: str, json_content: Dict):
    portal_def = {
        "class": "Portal",
        "kwargs": {
            "authenticator": {
                "class": "UMCAuthenticator",
                "kwargs": {
                    "group_cache": {
                        "class": "GroupFileCache",
                        "kwargs": {
                            "cache_file": {
                                "type": "static",
                                "value": "/var/cache/univention-portal/groups.json",
                            },
                        },
                        "type": "class",
                    },
                    "umc_session_url": {"key": "umc_session_url", "type": "config"},
                    "auth_mode": {"key": "auth_mode", "type": "config"},
                },
                "type": "class",
            },
            "portal_cache": {
                "class": "PortalFileCache",
                "kwargs": {
                    "cache_file": {
                        "type": "static",
                        "value": "/var/cache/univention-portal/selfservice.json",
                    },
                    "reloader": {
                        "class": "PortalReloaderUDM",
                        "kwargs": {
                            "cache_file": {
                                "type": "static",
                                "value": "/var/cache/univention-portal/selfservice.json",
                            },
                            "portal_dn": {"key": "selfservice_portal_dn", "type": "config"},
                        },
                        "type": "class",
                    },
                },
                "type": "class",
            },
            "scorer": {
                "class": "PathScorer",
                "kwargs": {
                    "path": {"value": "/univention/selfservice", "type": "static"},
                    "fallback_score": {"value": 0.5, "type": "static"},
                },
                "type": "class"},
        },
        "type": "class",
    }
    json_content[name] = portal_def


def add(name: str, update: bool = True):
    json_content = read_portals_json()
    if name in json_content:
        if update:
            warn(f"Overwriting existing {name}")
        else:
            info(f"{name} already exists")
            return
    info("We will now create a new portal object together")
    info("Which class do you want it to be? Possible answers are:")
    possible_classes = [klass.__name__ for klass in get_all_dynamic_classes()]
    for klass in possible_classes:
        info(f"  {klass}()")
    info("  value")
    info("  config")
    klass_default = None
    if "Portal" in possible_classes:
        klass_default = "Portal()"
    portal_def = ask_value(name, klass_default=klass_default)
    json_content[name] = portal_def
    write_portals_json(json_content)
    success(f"{portals_json} written")
    info(f"You may want to 'push {name}' now")


def ask_value(name: str, klass_default: Union[str, None] = None, value_default: Union[str, None] = None) -> Dict:
    possible_classes = [klass.__name__ for klass in get_all_dynamic_classes()]
    choice = click.prompt(
        f"Choose the value of {name}",
        default=klass_default,
        type=click.Choice([klass + "()" for klass in possible_classes] + ["value", "config"]),
    )
    if choice == "value":
        while True:
            value = click.prompt(
                'Choose a native value (e.g, None, True, 10, "name")', default=value_default,
            )
            print(value_default)
            print(value)
            try:
                return {"type": "static", "value": ast.literal_eval(value)}
            except SyntaxError:
                info(click.style(f"Cannot parse {value}", fg="yellow"))
    elif choice == "config":
        value = click.prompt("Choose a config key from /usr/share/univention-portal/config.json")
        return {"type": "config", "key": value}
    else:
        klass_name = choice[:-2]
        klass = get_dynamic_classes(klass_name)
        info(f"Okay, got class {klass_name}")
        kwargs = {}
        try:
            spec = getfullargspec(klass.__init__)
        except TypeError:
            # __init__ not defined
            pass
        else:
            info(
                "A {} takes {} arguments ({})".format(
                    klass_name, len(spec.args) - 1, ", ".join(repr(arg) for arg in spec.args[1:]),
                ),
            )
            if spec.defaults:
                defaults = dict(
                    zip(spec.args[len(spec.args) - len(spec.defaults):], spec.defaults),
                )
            else:
                defaults = {}
            for arg in spec.args[1:]:
                klass_default = value_default = None
                if arg in defaults:
                    klass_default = "value"
                    value_default = repr(defaults[arg])
                elif camelcase(arg) in possible_classes:
                    klass_default = camelcase(arg) + "()"
                kwargs[arg] = ask_value(
                    arg, klass_default=klass_default, value_default=value_default,
                )
        info(click.style(f"Okay, {klass_name} initialized", fg="green"))
        ret = {"type": "class", "class": klass.__name__}
        if kwargs:
            ret["kwargs"] = kwargs
        return ret


def capfirst(value: str) -> Union[str, None]:
    if value:
        return value[0].upper() + value[1:]


def camelcase(value: str) -> Union[str, None]:
    if value:
        return "".join(capfirst(part) for part in value.split("_"))


def remove(name: str, purge: bool = False):
    json_content = read_portals_json()
    if not json_content.pop(name, None):
        warn(f"{name} does not exist in config file")
        return
    obj = get_obj(name)
    if not obj:
        warn(f"{name} does not exist in database")
    else:
        rm_localhost(obj)
        if purge and not any(meta.startswith("server:") for meta in obj.props.meta):
            obj.delete()
            success("Removed unused {} from database")
        else:
            obj.save()
    write_portals_json(json_content)
    success(f"{name} removed")


def list_portals():
    json_content = read_portals_json()
    for name, portal_def in json_content.items():
        info(f"{name}:")
        portal = make_obj(portal_def)
        info(f"  {portal!r}")


def push(name: str):
    from univention.udm import UDM, NoObject
    from univention.udm.encoders import Base64Bzip2BinaryProperty

    json_content = read_portals_json()
    if name not in json_content:
        warn(f"{name} does not exist in config file")
        return
    portal_def = json_content[name]
    udm = UDM.machine().version(1)
    data = udm.get("settings/data")
    base = "cn=config,cn=portals,cn=univention,{}".format(config_fetch("ldap_base"))
    try:
        obj = data.get(f"cn={name},{base}")
    except NoObject:
        obj = data.new(superordinate="cn=univention,{}".format(config_fetch("ldap_base")))
        obj.position = base
        obj.props.name = name
        obj.props.data_type = "portals/config"
        info("Creating a new settings/data object")
    json_data = json.dumps(portal_def)
    obj.props.data = Base64Bzip2BinaryProperty("data", raw_value=json_data)
    add_localhost(obj)
    obj.save()
    success(f"Saved {name} in {obj.dn}")


def pull(name: str):
    obj = get_obj(name)
    if not obj:
        warn(f"{name} does not exist in database")
        return
    json_data = json.loads(obj.props.data.raw)
    json_content = read_portals_json()
    json_content[name] = json_data
    write_portals_json(json_content)
    success(f"{portals_json} updated")
    if add_localhost(obj):
        obj.save()
        success(f"{obj.dn} updated")


def get_obj(name: str) -> Union[str, None]:
    from univention.udm import UDM, ConnectionError, NoObject

    try:
        udm = UDM.machine().version(1)
    except ConnectionError as exc:
        warn(str(exc))
        return None
    data = udm.get("settings/data")
    base = "cn=config,cn=portals,cn=univention,{}".format(config_fetch("ldap_base"))
    dn = f"cn={name},{base}"
    try:
        return data.get(dn)
    except NoObject:
        return None


def add_localhost(obj) -> Union[bool, None]:
    localhost = config_fetch("fqdn")
    server_key = f"server:{localhost}"
    if server_key not in obj.props.meta:
        obj.props.meta.append(server_key)
        return True


def rm_localhost(obj) -> Union[bool, None]:
    localhost = config_fetch("fqdn")
    server_key = f"server:{localhost}"
    if server_key in obj.props.meta:
        obj.props.meta.remove(server_key)
        return True


def update(names: List[str], reason: str = "force"):
    json_content = read_portals_json()
    if not names:
        names = json_content.keys()
    logger.debug("Names to update: %s", names)
    for _name in names:
        logger.debug('Updating %s', _name)
        try:
            portal_def = json_content[_name]
        except KeyError:
            warn(f"{_name} does not exist in config file")
        else:
            portal_obj = make_portal(portal_def)
            start = datetime.datetime.now()
            if portal_obj.refresh(reason=reason):
                delta = datetime.datetime.now() - start
                success(f"Portal data updated in {delta.total_seconds():.2f}s")
            else:
                info("Portal data untouched")


def list_extensions():
    for extension in get_all_dynamic_classes():
        print(extension.__name__)
        if extension.__doc__:
            if extension.__doc__[0] == "\n":
                doc = extension.__doc__[1:]
            else:
                doc = extension.__doc__
            print("  " + "\n  ".join(dedent(doc).splitlines()))
            print("")


class SomeObj(object):
    def __init__(self, klass_name: str, args, kwargs):
        self.klass_name = klass_name
        self.args = args
        self.kwargs = kwargs

    def all_args(self) -> str:
        ret = []
        for arg in self.args:
            ret.append(repr(arg))
        for name, arg in self.kwargs.items():
            ret.append(f"{name}={arg!r}")
        return ", ".join(ret)

    def __repr__(self) -> str:
        return f"{self.klass_name}({self.all_args()})"


def make_obj(obj_def: Dict) -> Union[str, SomeObj]:
    arg_type = obj_def["type"]
    if arg_type == "static":
        return obj_def["value"]
    elif arg_type == "config":
        return config_fetch(obj_def["key"])
    if arg_type == "class":
        args = []
        kwargs = {}
        for _arg_definition in obj_def.get("args", []):
            args.append(make_obj(_arg_definition))
        for name, _arg_definition in obj_def.get("kwargs", {}).items():
            kwargs[name] = make_obj(_arg_definition)
        return SomeObj(obj_def["class"], args, kwargs)
    raise TypeError(f"Unknown obj_def: {obj_def!r}")


def warn(msg: str):
    logger.warning(msg)
    if not _silent:
        click.echo(click.style(msg, fg="yellow"))


def info(msg: str):
    logger.info(msg)
    if not _silent:
        click.echo(msg)


def success(msg: str):
    logger.info(msg)
    if not _silent:
        click.echo(click.style(msg, fg="green"))
