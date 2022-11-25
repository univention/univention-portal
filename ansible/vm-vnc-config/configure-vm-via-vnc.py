#!/usr/bin/env nix-shell
#!nix-shell -i python3 -p "python3.withPackages(ps: with ps; [ vncdo ])"

import logging
import os

import vncdotool.api


def main():
    # TODO: setting?
    logging.basicConfig(level=logging.DEBUG)

    # TODO: should come from somewhere
    server = "skurup.knut.univention.de"
    port = "5932"

    base_path = get_base_path()
    client = connect_client(server, port)

    # somewhat deterministic mouse, important if watching and accidentally
    # moving the mouse
    client.mouseMove(100, 700)

    client.expectScreen(os.path.join(base_path, 'screens/await-initial-screen.png'))

    raise NotImplementedError("expect worked")

    client.keyPress('tab')

    for k in 'Berlin':
        client.keyPress(k)

    client.keyPress('tab')
    client.keyPress('enter')

    client.captureScreen(os.path.join(base_path, 'screenshot.png'))

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
