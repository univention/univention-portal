FROM gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-506:0.10.0 AS base

#hadolint ignore=DL3008
RUN \
  apt-get --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    "build-essential=12.6" \
    "devscripts=2.19.*" \
    "gettext=0.19.*" \
    "git=1:2.20.*" \
    "univention-l10n-dev=7.0.*" \
    "wget=1.20.*" \
  && rm -rf "/var/lib/apt/lists/*" "/var/cache/apt/archives/*"

ENV NODE_VERSION="14.21.1"

RUN \
  wget --progress="dot:giga" "https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh" \
  && echo "69da4f89f430cd5d6e591c2ccfa2e9e3ad55564ba60f651f00da85e04010c640  install.sh" > "SHA256" \
  && sha256sum --check "SHA256" \
  && bash "install.sh" \
  && . ~/.nvm/nvm.sh \
  && nvm install "${NODE_VERSION}" \
  && mkdir -p "/src" \
  && rm -f "install.sh"

WORKDIR /src
