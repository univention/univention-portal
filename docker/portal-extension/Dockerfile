# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.5-build.20260430@sha256:03506bb1c0b315bcecc00cb77e7fe7df6f414e581a1a73a9f66f93e731237ae8
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
