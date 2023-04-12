from locust import HttpUser, task


class WebsiteUser(HttpUser):

    @task
    def notifications(self):
        self.client.get("/v1/notifications/")
