# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}busybox:1.36.1@sha256:9ae97d36d26566ff84e8893c64a6dc4fe8ca6d1144bf5b87b2b85a32def253c7

WORKDIR /

# Structure according to
# https://git.knut.univention.de/univention/internal/nubus-infocenter/-/blob/main/topics/extensions/extension-image-structure.md?ref_type=heads

COPY udm/acls /plugins/ldap-acls
COPY udm/api /plugins/udm-modules
COPY udm/syntax /plugins/admin-syntax.d
COPY udm/handlers /plugins/admin-handlers/portals
COPY udm/icons /plugins/umc-icons
COPY udm/schema /plugins/ldap-schema
COPY udm/syntax /plugins/syntax
COPY udm/univention-portal.xml /plugins/umc-modules/

COPY docker/portal-extension/loader.sh /bin/loader

CMD ["/bin/loader"]
