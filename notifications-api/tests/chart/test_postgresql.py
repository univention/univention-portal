from univention.testing.helm.client.postgresql import PostgresqlClient


class TestPostgresqlClient(PostgresqlClient):

    default_username = "notificationsapi"
    default_database = "notificationsapi"
    secret_name = "release-name-notifications-api-postgresql"

    path_main_container = "spec.template.spec.containers[?@.name=='notification-api']"
