import importlib.util
import os
import os.path
from unittest import mock

import pytest


LISTENER_PATH = "./listener"


def load_listener(name):
    module_name = os.path.splitext(name)[0]
    spec = importlib.util.spec_from_file_location(module_name, os.path.join(LISTENER_PATH, name))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_portal_listener_default_call():
    listener = load_listener("portal_server.py")
    expected_call_args = [
        "/usr/sbin/univention-portal",
        "update",
        "--reason",
        "stub_reason",
    ]
    assert listener._get_portal_call("stub_reason") == expected_call_args


def test_portal_listener_sets_log_stream_based_on_environment():
    listener = load_listener("portal_server.py")
    with mock.patch.dict(os.environ, {"PORTAL_LISTENER_LOG_STREAM": "true"}):
        call_args = listener._get_portal_call("stub_reason")

    expected_call_args = [
        "/usr/sbin/univention-portal",
        "--log-stream",
        "update",
        "--reason",
        "stub_reason",
    ]
    assert call_args == expected_call_args
