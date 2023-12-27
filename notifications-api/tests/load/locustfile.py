# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

from locust import HttpUser, task


class WebsiteUser(HttpUser):

    @task
    def notifications(self):
        self.client.get("/v1/notifications/")
