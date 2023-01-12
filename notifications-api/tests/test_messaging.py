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
