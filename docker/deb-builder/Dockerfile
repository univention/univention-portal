# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.7-build.20261022@sha256:6b488e8625d0fc0a45f0945703c5cbbb1753ac904dfde1c3a668ad472d5dc7f8
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
