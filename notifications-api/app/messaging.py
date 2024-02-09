# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

"""Provides the needed infrastructure for messaging events."""

import asyncio
import logging
import threading

import zmq
import zmq.asyncio


log = logging.getLogger(__name__)

context = zmq.asyncio.Context()

_background_tasks = set()

in_address = "inproc://in"
out_address = "inproc://out"


def startup_messaging():
    """Main entry point to hook up the routing of notification events."""
    log.info("Setting up messaging for notification events")
    task = asyncio.create_task(message_broker())
    _background_tasks.add(task)
    task.add_done_callback(_background_tasks.discard)
    log.debug("Setup of the messaging is done")


async def message_broker():
    """
    The message broker is offering stable endpoints.

    It offers one endpoint where others can publish events, and then it does
    forward those onto the other stable endpoint which the streams can connect
    to so that they receive their events.
    """
    log.debug("Starting the process internal message broker loop")

    # This uses a SUB socket as a server, so that the request handlers can
    # publish onto this socket. It's reversed compared to the common pub sub
    # usage.
    socket_in = context.socket(zmq.SUB)
    socket_in.subscribe(b"")
    socket_in.bind(in_address)

    # This is the socket which the listening event streams actually subscribe
    # to.
    socket_out = context.socket(zmq.PUB)
    socket_out.bind(out_address)

    log.debug("Entering the message broker main loop")
    while True:
        message = await socket_in.recv_multipart()
        log.debug("Forwarding message: %s", message)
        await socket_out.send_multipart(message)


async def receive_notifications(topic):
    log.debug("Receiving events for topic: %s", topic)
    socket = context.socket(zmq.SUB)
    socket.connect(out_address)
    socket.subscribe(topic.encode())
    try:
        while True:
            topic, message = await socket.recv_multipart()
            yield message.decode()
    except asyncio.CancelledError as e:
        log.debug("Stopped receiving, cleanup. Topic: %s", topic)
        socket.close()
        raise e


# Avoiding to re-create the socket per coroutine. Storing the socket as a
# thread local should prevent surprises if anyone ever runs this with multiple
# threads.
_thread_local = threading.local()


async def publish_notification(topic, event_data):
    socket = await _ensure_socket()
    log.debug("Publishing event for topic: %s", topic)
    message = (topic.encode(), event_data.encode())
    await socket.send_multipart(message)


async def _ensure_socket():
    socket = getattr(_thread_local, "socket", None)
    if not socket:
        log.debug("Creating new publishing socket for publish_notification")
        socket = _thread_local.socket = context.socket(zmq.XPUB)
        socket.connect(in_address)
        # We have to be sure to await until the corresponding SUB socket has
        # connected. Otherwise the first message would be lost.
        await socket.recv()
    return socket
