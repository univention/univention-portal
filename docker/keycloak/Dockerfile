FROM quay.io/keycloak/keycloak:19.0.2

USER root

# install SSL certificate from UCS
WORKDIR /usr/lib/jvm/jre/lib/security
COPY ./docker/keycloak/ucs-root-ca.crt /usr/lib/jvm/jre/lib/security
RUN keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias ldapcert -file ucs-root-ca.crt

# install dependencies for entrypoint script
RUN microdnf install jq && \
    microdnf clean all

# grab realm export as template
WORKDIR /opt/keycloak
COPY ./docker/keycloak/realm-export.json /opt/keycloak/realm-export.json
USER 1001

COPY ./docker/keycloak/docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [ \
    "/opt/keycloak/bin/kc.sh", \
    "start-dev", \
    "--http-enabled=true", \
    "--import-realm" \
]