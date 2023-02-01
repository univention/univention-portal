
from app.crud.notification_service import NotificationService


def test_pop_notification_for_sse(filled_db):
    service = NotificationService(filled_db)
    result = service.pop_notifications_for_sse()
    assert len(result) == 2
