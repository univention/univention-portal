ARG LISTENER_BASE_IMAGE_TAG=latest
ARG LISTENER_BASE_IMAGE=gitregistry.knut.univention.de/univention/customers/dataport/upx/container-listener-base/listener-base

FROM ${LISTENER_BASE_IMAGE}:${LISTENER_BASE_IMAGE_TAG}

COPY ./listener/*.py /usr/lib/univention-directory-listener/system/
