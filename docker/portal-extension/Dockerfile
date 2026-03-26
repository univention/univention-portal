# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2025 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.5-build.20260326@sha256:8381ca70cdad990e82dd44a9cb58a04be22cef60ef50a025a42a7620dcb09a9e
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
