# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.5-build.20260514@sha256:81b104694a78cf36043f84b5d9e4b3b0cbbe6777e46877239a44f08249379119
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS base

#hadolint ignore=DL3008
RUN \
  apt-get --assume-yes --verbose-versions --no-install-recommends install \
    "build-essential" \
    "devscripts" \
    "gettext" \
    "git" \
    "univention-l10n-dev" \
    "wget"

ENV NODE_VERSION="24.15.0"

RUN \
  wget --progress="dot:giga" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh" \
    && echo "bdea8c52186c4dd12657e77e7515509cda5bf9fa5a2f0046bce749e62645076d  install.sh" > "SHA256" \
  && sha256sum --check "SHA256" \
  && bash "install.sh" \
  && . ~/.nvm/nvm.sh \
  && nvm install "${NODE_VERSION}" \
  && mkdir -p "/src" \
  && rm -f "install.sh"

WORKDIR /src
