ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520
ARG UCS_BASE_IMAGE_TAG=0.9.1

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS build-base


RUN apt-get update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
      ca-certificates=* \
      curl=7.88.* \
      ldap-utils=2.5.* \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*
