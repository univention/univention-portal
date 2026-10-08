# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.3.0-build.20261008@sha256:52175e1efb9452119ed135126afd931d4e2361bdc69bded46101e35fa27ae0d0
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG}

WORKDIR /

# Structure according to
# https://git.knut.univention.de/univention/internal/nubus-infocenter/-/blob/main/topics/extensions/extension-image-structure.md?ref_type=heads

COPY udm/acls /plugins/ldap-acls
COPY udm/api /plugins/udm-modules
COPY udm/handlers /plugins/udm-handlers/portals
COPY udm/icons /plugins/umc-icons
COPY udm/schema /plugins/ldap-schema
COPY udm/syntax /plugins/udm-syntax.d
COPY udm/udm-data-loader /plugins/udm-data-loader
COPY udm/univention-portal.xml /plugins/umc-modules/

COPY docker/portal-extension/loader.sh /bin/loader

CMD ["/bin/loader"]
