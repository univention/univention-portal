# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH


from app.crud.notification_service import NotificationService


def test_pop_notification_for_sse(filled_db):
    service = NotificationService(filled_db)
    result = service.pop_notifications_for_sse()
    assert len(result) == 1
