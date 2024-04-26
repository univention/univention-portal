# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

ARG LISTENER_BASE_IMAGE_TAG=0.4.6
ARG LISTENER_BASE_IMAGE=gitregistry.knut.univention.de/univention/customers/dataport/upx/container-listener-base/listener-base:${LISTENER_BASE_IMAGE_TAG}

# in the pipeline, this will be set to whatever the current image tag for portal-server in that pipeline is (e.g. vX.Y.Z)
ARG PORTAL_BASE_IMAGE_TAG=latest
ARG PORTAL_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/univention-portal/portal-server:${PORTAL_BASE_IMAGE_TAG}

# hadolint ignore=DL3006
FROM ${PORTAL_BASE_IMAGE} as portal-server-image

FROM ${LISTENER_BASE_IMAGE}

# TODO: Duplicated from the portal-server
RUN apt-get update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    jq=1.5+* \
    python3=3.7.* \
    python3-pip=18.1-5 \
    python3-boto3=1.9.* \
    python3-univention-directory-manager-rest-client=10.* \
    univention-group-membership-cache=2.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN pip3 install --upgrade pip
RUN pip3 install provisioning-consumer-lib --index-url https://git.knut.univention.de/api/v4/projects/882/packages/pypi/simple

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


COPY --from=portal-server-image /usr/local/lib/python3.7 /usr/local/lib/python3.7
COPY --from=portal-server-image /app/univention-portal /usr/sbin/univention-portal
COPY --from=portal-server-image /entrypoint.d/50-entrypoint.sh /entrypoint.d/25-docker-entrypoint.sh

COPY ./docker/portal-consumer/stub_portals.json /usr/share/univention-portal/portals.json
COPY ./docker/portal-consumer/portal-consumer-entrypoint.sh /entrypoint.d/75-portal-consumer-entrypoint.sh
COPY ./docker/portal-consumer/initialize.sh /
COPY ./portal_consumer/consumer.py /

CMD ["/usr/bin/python3", "consumer.py"]