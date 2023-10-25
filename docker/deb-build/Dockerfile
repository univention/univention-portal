FROM gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-505:v0.7.5 AS base

#hadolint ignore=DL3008
RUN \
  apt-get --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    "build-essential=12.6" \
    "curl=7.64.*" \
    "devscripts=2.19.*" \
    "gettext=0.19.*" \
    "git=1:2.20.*" \
    "univention-l10n-dev=7.0.*" \
  && rm -rf "/var/lib/apt/lists/*" "/var/cache/apt/archives/*"

ENV NODE_VERSION="14.21.1"

ADD https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh /tmp/install.sh
RUN bash /tmp/install.sh \
  && . ~/.nvm/nvm.sh \
  && nvm install "$NODE_VERSION" \
  && mkdir -p /src

WORKDIR /src
