import os
import pytest


class Environ():

    def __init__(self, dict_):
        self._dict = dict_

    def __getattr__(self, name):
        return self._dict[name]


@pytest.fixture(scope="session")
def environ():
    """
    Returns a simple adapter to access environment variables as attributes.
    """
    return Environ(os.environ)
