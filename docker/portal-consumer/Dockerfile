# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=0.13.1-build-2024-07-04
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520

# in the pipeline, this will be set to whatever the current image tag for portal-server in that pipeline is (e.g. vX.Y.Z)
ARG PORTAL_BASE_IMAGE_TAG=latest
ARG PORTAL_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/univention-portal/portal-server:${PORTAL_BASE_IMAGE_TAG}

# hadolint ignore=DL3006
FROM ${PORTAL_BASE_IMAGE} as portal-server-image

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} as final

# TODO: Duplicated from the portal-server
RUN apt-get --assume-yes --verbose-versions --no-install-recommends install \
    jq=1.6-2.* \
    python3=3.11.* \
    python3-pip=23.0.* \
    python3-boto3=1.26.* \
    gcc=4:12.2.* \
    libsasl2-dev=2.* \
    python3-dev=3.11.* \
    libldap2-dev=2.* \
    univention-config-registry=17.0.* \
    python3-univention-directory-manager-rest-client=12.0.* \
    univention-group-membership-cache=4.0.* \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY ./docker/portal-consumer/requirements.txt /
RUN pip3 install --break-system-packages --no-cache-dir -r requirements.txt

# TODO: Duplicated from the portal-server
RUN mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log \
    && mkdir -p /usr/share/univention-portal \
    && mkdir -p /usr/share/univention-portal/icons/entries \
    && mkdir -p /usr/lib/univention-portal/config \
    && mkdir -p /var/cache/univention-portal \
    && touch /var/cache/univention-portal/groups.json \
    && touch /var/cache/univention-portal/portal.json \
    && touch /var/cache/univention-portal/selfservice.json

COPY --from=portal-server-image /usr/local/lib/python3.7/dist-packages/univention /usr/local/lib/python3.11/dist-packages/univention
COPY --from=portal-server-image /app/univention-portal /usr/sbin/univention-portal
COPY --from=portal-server-image /entrypoint.d/50-entrypoint.sh /entrypoint.d/25-docker-entrypoint.sh

COPY ./docker/portal-consumer/stub_portals.json /usr/share/univention-portal/portals.json
COPY ./docker/portal-consumer/ldap-setup.envsh /entrypoint.d/50-ldap-setup.envsh
COPY ./docker/portal-consumer/machine-secret-entrypoint.sh /entrypoint.d/75-machine-secret-entrypoint.sh
COPY ./docker/portal-consumer/initialize.sh /
COPY ./portal_consumer/ /

# Create listener user for group membership cache
RUN useradd -m "listener"

CMD ["/usr/bin/python3", "consumer.py"]