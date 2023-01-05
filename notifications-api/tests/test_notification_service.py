
from app.crud.notification_service import NotificationService


def test_pop_notification_for_sse(filled_db):
    service = NotificationService()
    result = service.pop_notifications_for_sse(db=filled_db)
    assert len(result) == 2
