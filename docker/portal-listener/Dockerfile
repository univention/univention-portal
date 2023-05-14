ARG LISTENER_BASE_IMAGE_TAG=latest
ARG LISTENER_BASE_IMAGE=gitregistry.knut.univention.de/univention/customers/dataport/upx/container-listener-base/listener-base

ARG PORTAL_BASE_IMAGE_TAG=latest
ARG PORTAL_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/univention-portal/portal-server

FROM ${PORTAL_BASE_IMAGE}:${PORTAL_BASE_IMAGE_TAG} as portal-server-image

FROM ${LISTENER_BASE_IMAGE}:${LISTENER_BASE_IMAGE_TAG}

COPY --from=portal-server-image /usr/local/lib/python3.7 /usr/local/lib/python3.7
COPY --from=portal-server-image /app/univention-portal /usr/sbin/univention-portal

# TODO: remove
COPY univention-portal /usr/sbin/univention-portal

COPY ./listener/*.py /usr/lib/univention-directory-listener/system/
