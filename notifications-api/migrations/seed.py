import uuid

from faker import Faker

from app.db import get_session
from app.models.notification_model import (
    Notification, NotificationType, NotificationSeverity)

fake = Faker()


def seed_notification_table(n):
    session = next(get_session())
    print(f"Seeding {Notification}.")
    for _ in range(n):
        # TODO: This is not in sync anymore with the model schema
        session.add(Notification(
            id=uuid.uuid4().hex,
            source_uuid=uuid.uuid4().hex,
            target_uuid=uuid.uuid4().hex,
            title=fake.sentence(),
            type=NotificationType.ALERT,
            severity=NotificationSeverity.INFO,
            send_time=fake.date_time(),
        ))
    session.commit()
    print(f"Seeded {Notification}.")


if __name__ == "__main__":
    seed_notification_table(25)
