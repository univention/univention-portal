
from app.crud.notification_service import NotificationService




def test_pop_notification_for_sse():
    service = NotificationService()
    result = service.pop_notifications_for_sse()
    assert False, "implement me"
