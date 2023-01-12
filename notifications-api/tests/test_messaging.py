from unittest import mock
import json
import pytest

from app import messaging


@pytest.mark.asyncio
async def test_publish_notification_sends_message_via_socket(mocker):
    mock_socket = mock.AsyncMock()
    mocker.patch.object(
        messaging, '_ensure_socket', mock.AsyncMock(return_value=mock_socket))
    stub_topic = "stub_topic"
    stub_data = json.dumps({"stub": "data"})
    await messaging.publish_notification(stub_topic, stub_data)
    expected_message = (stub_topic.encode(), stub_data.encode())
    mock_socket.send_multipart.assert_called_once_with(expected_message)


@pytest.mark.asyncio
async def test_ensure_socket_creates_socket(mocker):
    mock_socket = mock.MagicMock()
    mock_socket.recv = mock.AsyncMock()
    mock_context = mock.MagicMock()
    mock_context.socket.return_value = mock_socket

    mocker.patch.object(messaging, 'context', mock_context)

    result = await messaging._ensure_socket()

    assert result == mock_socket


@pytest.mark.asyncio
async def test_ensure_socket_creates_no_socket():
    mock_socket = mock.MagicMock()
    mock_socket.recv = mock.AsyncMock()

    messaging._thread_local.socket = mock_socket
    result = await messaging._ensure_socket()

    assert result == mock_socket


@pytest.mark.asyncio
async def test_message_broker(mocker):
    mock_socket_in = mock.MagicMock()
    mock_socket_in.recv_multipart = mock.AsyncMock()
    mock_socket_out = mock.MagicMock()
    stub_exc = Exception("Helps to break the while true loop.")
    mock_socket_out.send_multipart.side_effect = stub_exc
    mock_context = mock.MagicMock()
    mock_context.socket.side_effect = [mock_socket_in, mock_socket_out]
    mocker.patch.object(messaging, 'context', mock_context)

    with pytest.raises(Exception) as raised_exception:
        await messaging.message_broker()
    assert raised_exception.value == stub_exc
    mock_socket_in.recv_multipart.assert_called_once()
    mock_socket_out.send_multipart.assert_called_once()
