# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520
ARG UCS_BASE_IMAGE_TAG=0.13.1-post-main-build-2024-09-09

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS build-base

RUN apt-get --assume-yes --verbose-versions --no-install-recommends install \
    gcc=4:12.* \
    libsasl2-dev=2.* \
    python3=3.11.* \
    python3-pip=23.* \
    python3-setuptools=66.* \
    python3-dev=3.11.* \
    libldap2-dev=2.* \
    python3-univention-directory-manager-rest-client=12.* \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/* \
  && rm /usr/lib/python*/EXTERNALLY-MANAGED

WORKDIR /staging/
COPY ./requirements.txt .
RUN pip3 install --ignore-installed --no-cache-dir -r requirements.txt


FROM build-base AS build

# TODO: The debian packaging files are included by setup.py and copied due to
# this reason. This will have to be adapted once the former debian packaging will
# be removed.
COPY ./debian/changelog ./debian/changelog
COPY ./debian/control ./debian/control
COPY ./python ./python
COPY ./portal_consumer ./portal_consumer
COPY ./setup.py .

RUN pip3 install --no-cache-dir .


FROM build-base AS test
WORKDIR /staging/

# hadolint ignore=DL3008
RUN apt-get -qq update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
      python3-univention-directory-manager \
      univention-group-membership-cache=4.* \
      python3-boto3 \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY ./requirements-test.txt .
RUN pip3 install --no-cache-dir --upgrade pip==24.* \
    && pip3 install --no-cache-dir -r requirements-test.txt \
    && mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log

CMD ["pytest", "unittests"]

FROM build-base AS final

RUN apt-get update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    jq=1.* \
    python3=3.11.* \
    # libldap2-dev is required to make python-ldap work.
    # Currently this is used in the portal server to parse the DNs via "str2dn".
    libldap2-dev=2.* \
    python3-univention-directory-manager-rest-client=12.* \
    python3-boto3=1.26.* \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /app/

RUN mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log \
    && mkdir -p /usr/share/univention-portal \
    && mkdir -p /usr/lib/univention-portal/config

COPY ./univention-portal-server /usr/sbin/univention-portal-server
COPY ./univention-portal .
COPY --from=build /staging/requirements.txt .
COPY --from=build /usr/local/lib/python3.11 /usr/local/lib/python3.11

# Considered to be part of the application.
#
# Users MAY provide a different file from the outside if the portal server
# components shall be configured in a different way. This is not an intended
# usage of the container though.
COPY ./docker/portal-server/stub_portals.json /usr/share/univention-portal/portals.json

COPY ./docker/portal-server/docker-entrypoint.sh /entrypoint.d/50-entrypoint.sh

EXPOSE 80

CMD ["/usr/bin/python3", "/usr/sbin/univention-portal-server"]

# [EOF]
