# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

# TODO: Plugins should have a tiny base image which support moving files around,
# e.g. busybox alike.
ARG UCS_BASE_IMAGE_TAG=0.12.0
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG}

# TODO: A sane user should be configured in the base image already.
RUN adduser app
USER app

WORKDIR /
COPY udm/acls /plugins/ldap-acls
COPY udm/api /plugins/udm-modules
COPY udm/syntax /plugins/admin-syntax.d
COPY udm/handlers /plugins/admin-handlers/portals
COPY udm/icons /plugins/umc-icons
COPY udm/schema /plugins/ldap-schema
COPY udm/syntax /plugins/syntax
COPY udm/univention-portal.xml /plugins/umc-modules/

# NOTE: Loader API, there must be a contract around this, e.g. "/bin/loader" is
# called, and "/target" is mounted.
COPY docker/portal-extension/loader.sh /bin/loader

CMD ["/bin/loader"]
