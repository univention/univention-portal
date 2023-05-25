FROM docker-registry.knut.univention.de/phahn/ucs-debbase:503 AS base

#hadolint ignore=DL3008
RUN apt-get update \
    && apt-get --assume-yes --no-install-recommends install \
      git \
      build-essential \
      devscripts \
      curl \
      univention-l10n-dev \
    && rm -fr /var/lib/apt/lists/*

ENV NODE_VERSION="14.21.1"

ADD https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh /tmp/install.sh
RUN bash /tmp/install.sh \
  && . ~/.nvm/nvm.sh \
  && nvm install "$NODE_VERSION" \
  && mkdir -p /src

WORKDIR /src
