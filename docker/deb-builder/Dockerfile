# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2025 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.2.2-build.20250821@sha256:839b93e89298c51a9c8cd45c119a284f9161b18d7270da4dc92588772ca20f4d
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

ENV NODE_VERSION="20.17.0"

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
