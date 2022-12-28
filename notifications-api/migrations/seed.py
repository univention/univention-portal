import uuid

from faker import Faker
from faker.providers import DynamicProvider

from app.db import get_session
from app.models.notification_model import (
    Notification, NotificationType, NotificationSeverity)

fake = Faker()

notification_type_provider = DynamicProvider(
    provider_name="notification_type",
    elements=[x.value for x in NotificationType])
fake.add_provider(notification_type_provider)



# TODO: Check how the seeding logic can be executed in the test suite.
# Otherwise it will run out of sync with the models over time again.
def seed_notification_table(n):
    session = next(get_session())
    print(f"Seeding {Notification}.")
    for _ in range(n):
        session.add(Notification(
            id=uuid.uuid4().hex,
            sourceUid=uuid.uuid4().hex,
            targetUid=uuid.uuid4().hex,
            title=fake.sentence(),
            details=fake.sentence(),
            notificationType=fake.notification_type(),
            severity=NotificationSeverity.INFO,
            receiveTime=fake.date_time(),
        ))
    session.commit()
    print(f"Seeded {Notification}.")


if __name__ == "__main__":
    seed_notification_table(25)
