#!/usr/bin/env nix-shell
#!nix-shell -i python3 -p "python3.withPackages(ps: with ps; [ vncdo ])"

import logging
import os

import vncdotool.api


class InitialConfigurationViaVNC(object):
    """
    Implements the initial configuration via a VNC connection.
    """

    def __init__(self):
        # TODO: should come from somewhere
        server = "skurup.knut.univention.de"
        port = "5932"

        self.base_path = get_base_path()
        self.client = connect_client(server, port)

    def run(self):
        # TODO: setting?
        logging.basicConfig(level=logging.DEBUG)

        # somewhat deterministic mouse, important if watching and accidentally
        # moving the mouse
        self.client.mouseMove(100, 700)

        self.client.captureScreen("screenshot.png")

        # self.expect_and_fill_first_screen()
        # self.expect_and_fill_localization_screen()
        # self.expect_and_fill_domain_and_network()
        # self.expect_and_fill_domain_setup()
        self.expect_and_fill_account_information()

        raise NotImplementedError("expect worked")


        client.captureScreen(os.path.join(base_path, 'screenshot.png'))

        raise NotImplementedError("implement me!")


    def expect_and_fill_first_screen(self):
        self.client.expectScreen(
            os.path.join(self.base_path, "screens/await-initial-screen.png"))

        self.client.keyPress("tab")
        for k in "Berlin":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        self.client.keyPress("enter")

    def expect_and_fill_localization_screen(self):
        self.client.expectScreen(
            os.path.join(self.base_path, "screens/await-localization-settings.png"))

        self.client.keyPress("tab")
        for k in "Europe-Berlin":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        self.client.keyPress("tab")
        self.client.keyPress("tab")
        self.client.keyPress("enter")

    def expect_and_fill_domain_and_network(self):
        self.client.expectScreen(
            os.path.join(self.base_path, "screens/await-domain-and-network.png"))

        self.client.keyPress("space")
        self.client.keyPress("tab")
        for k in "10.200.115.20":
            self.client.keyPress(k)
        for _ in range(7):
            self.client.keyPress("tab")
        self.client.keyPress("enter")

    def expect_and_fill_domain_setup(self):
        self.client.expectScreen(
            os.path.join(self.base_path, "screens/await-domain-setup.png"))

        for _ in range(3):
            self.client.keyPress("tab")
        self.client.keyPress("enter")

    def expect_and_fill_account_information(self):
        # self.client.expectScreen(
        #     os.path.join(self.base_path, "screens/await-account-information.png"))

        # TODO: This is too much for the connection to handle. Either the
        # client is broken, or it's sending things so fast that they get mixed
        # up on the server end.

        for k in "Univention":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        self.client.keyPress("tab")
        for k in "johannes.bornhold.extern":
            self.client.keyPress(k)
        self.client.keyPress('shift-"')
        for k in "univention.de":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        for k in "univention":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        for k in "univention":
            self.client.keyPress(k)
        self.client.keyPress("tab")
        self.client.keyPress("tab")
        self.client.keyPress("enter")


def connect_client(server, port):
    connection_string = "{server}::{port}".format(
        server=server, port=port)
    return vncdotool.api.connect(connection_string)

def get_base_path():
    script_directory = os.path.abspath(
        os.path.dirname(__file__))
    return script_directory


InitialConfigurationViaVNC().run()
