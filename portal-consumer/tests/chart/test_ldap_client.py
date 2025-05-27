from univention.testing.helm.client.ldap import Ldap


class TestLdapClient(Ldap):

    config_map_name = "release-name-portal-consumer-common"
    secret_name = "release-name-portal-consumer-ldap"

    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"
