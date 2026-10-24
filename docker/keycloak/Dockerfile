# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

FROM quay.io/keycloak/keycloak:26.8.1@sha256:a78d6b79572168cb25886b80a8b5b8d4ed4390743e3eecb810538683e209dd6b

USER root

# install SSL certificate from UCS
WORKDIR /usr/lib/jvm/jre/lib/security
COPY ./docker/keycloak/ucs-root-ca.crt /usr/lib/jvm/jre/lib/security
RUN keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias ldapcert -file ucs-root-ca.crt

# install dependencies for entrypoint script
RUN microdnf install -y jq-1.6 && \
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
    "--health-enabled=true", \
    "--http-enabled=true", \
    "--import-realm" \
]

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD curl --fail 'http://localhost:8097/health/live' | jq --exit-status '.status == "UP"'
