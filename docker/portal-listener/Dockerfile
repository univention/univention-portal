ARG LISTENER_BASE_IMAGE_TAG=latest
ARG LISTENER_BASE_IMAGE=gitregistry.knut.univention.de/univention/customers/dataport/upx/container-listener-base/listener-base:${LISTENER_BASE_IMAGE_TAG}

ARG PORTAL_BASE_IMAGE_TAG=latest
ARG PORTAL_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/univention-portal/portal-server:${PORTAL_BASE_IMAGE_TAG}

# hadolint ignore=DL3006
FROM ${PORTAL_BASE_IMAGE} as portal-server-image

# hadolint ignore=DL3006
FROM ${LISTENER_BASE_IMAGE}

# TODO: Duplicated from the portal-server
RUN apt-get update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    jq=1.5+* \
    python3=3.7.* \
    # libldap2-dev is required to make python-ldap work.
    # Currently this is used in the portal server to parse the DNs via "str2dn".
    libldap2-dev=2.* \
    python3-univention-directory-manager-rest-client=10.* \
    univention-group-membership-cache=2.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

# TODO: Duplicated from the portal-server
RUN mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log \
    && mkdir -p /usr/share/univention-portal \
    && mkdir -p /usr/share/univention-portal/icons/entries \
    && mkdir -p /usr/lib/univention-portal/config \
    && mkdir -p /var/cache/univention-portal \
    && touch /var/cache/univention-portal/groups.json \
    && touch /var/cache/univention-portal/portal.json

COPY --from=portal-server-image /usr/local/lib/python3.7 /usr/local/lib/python3.7
COPY --from=portal-server-image /app/univention-portal /usr/sbin/univention-portal
COPY --from=portal-server-image /docker-entrypoint.sh /
COPY --from=portal-server-image /app/listener/*.py /usr/lib/univention-directory-listener/system

COPY ./docker/portal-listener/stub_portals.json /usr/share/univention-portal/portals.json

COPY ./docker/portal-listener/portal-listener-entrypoint.sh /
COPY ./docker/portal-listener/initialize.sh /

# The entrypoint scripts are chained:
#
# - The one from the portal-server, it prepares the file "config.json".
#
# - The one from the base listener container does ensure that basic UCR
#   parameters are set as needed.
#
# - The portal listener specific one does contain the listener specific
#   needs.
#
# It is possible to chain the entrypoint scripts since they all call 'exec "$@"'
# as the last call.
ENTRYPOINT [ \
    "/docker-entrypoint.sh", \
    "/listener-base-entrypoint.sh", \
    "/portal-listener-entrypoint.sh"]
CMD ["/command.sh"]
