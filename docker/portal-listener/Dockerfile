ARG LISTENER_BASE_IMAGE_TAG=latest
ARG LISTENER_BASE_IMAGE=gitregistry.knut.univention.de/univention/customers/dataport/upx/container-listener-base/listener-base

ARG PORTAL_BASE_IMAGE_TAG=latest
ARG PORTAL_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/univention-portal/portal-server

FROM ${PORTAL_BASE_IMAGE}:${PORTAL_BASE_IMAGE_TAG} as portal-server-image

FROM ${LISTENER_BASE_IMAGE}:${LISTENER_BASE_IMAGE_TAG}

# TODO: Duplicated from the portal-server
RUN apt-get update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    jq=1.5+* \
    python3=3.7.* \
    # libldap2-dev is required to make python-ldap work.
    # Currently this is used in the portal server to parse the DNs via "str2dn".
    libldap2-dev=2.* \
    python3-univention-directory-manager-rest-client=10.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

# TODO: Duplicated from the portal-server
RUN mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log \
    && mkdir -p /usr/share/univention-portal \
    && mkdir -p /usr/lib/univention-portal/config

COPY --from=portal-server-image /usr/local/lib/python3.7 /usr/local/lib/python3.7
COPY --from=portal-server-image /app/univention-portal /usr/sbin/univention-portal
COPY --from=portal-server-image /usr/share/univention-portal/portals.json /usr/share/univention-portal/portals.json

# TODO: remove
COPY univention-portal /usr/sbin/univention-portal

COPY ./listener/*.py /usr/lib/univention-directory-listener/system/
