# TODO: environment auto-provided

import os

import vncdotool.api


def main():
    # TODO: should come from somewhere
    server = "skurup.knut.univention.de"
    port = "5932"

    base_path = get_base_path()
    client = connect_client(server, port)

    client.expectScreen(os.path.join(base_path, 'screens/await-initial-screen.png'))

    # client.captureScreen(os.path.join(base_path, 'screenshot.png'))

    raise NotImplementedError("implement me!")


def connect_client(server, port):
    connection_string = "{server}::{port}".format(
        server=server, port=port)
    return vncdotool.api.connect(connection_string)

def get_base_path():
    script_directory = os.path.abspath(
        os.path.dirname(__file__))
    return script_directory


main()
