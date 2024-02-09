# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

import uuid

from faker import Faker

from app.db import get_session
from app.models.notification_model import Notification, NotificationSeverity


fake = Faker()


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
            severity=NotificationSeverity.INFO,
        ))
    session.commit()
    print(f"Seeded {Notification}.")


if __name__ == "__main__":
    seed_notification_table(1)
