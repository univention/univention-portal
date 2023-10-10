
ARG UCS_BASE_IMAGE_TAG="v0.7.5"
ARG UCS_BASE_IMAGE="gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520"

###############################################################################
# Creates a yarn builder

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS local-dev-env

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# The following dependencies are only needed when on an aarch64 platform,
# because then the package "deasync" does not include ready made binaries
# for the platform and falls back to compiling them.
#
# This is relevant for developers who work on machines with Apple's M1
# processors.
RUN \
  apt-get --quiet --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    "yarnpkg=1.22.*" \
  && if [[ "$(uname -m)" == "aarch64" ]]; then \
    apt-get --assume-yes --verbose-versions --no-install-recommends install \
      "gcc=4:8.*" \
      "g++=4:8.*" \
      "make=4.*" \
      "python3=3.7.*" \
  ; fi \
  && rm -fr "/var/lib/apt/lists/*" "/var/cache/apt/archives/*"

WORKDIR /app
CMD ["/bin/bash"]

###############################################################################
# Installs app dependencies

FROM local-dev-env as base
COPY ./package.json .
COPY ./yarn.lock .

RUN \
  npx browserslist@latest --update-db \
  && yarnpkg install --frozen-lockfile \
  && yarnpkg cache clean

# Copy should come after yarn install to prevent long rebuilding time
COPY . .

###############################################################################
# Starts a development server

# The dev-server stage is running a development server. This is intended to be
# used with the Tilt based development environment.
FROM base AS dev-server

# Define the command for the local-dev-env run in Tilt.
#
# Currently it is not possible to inject this from the Tilt configuration.
# See https://github.com/tilt-dev/tilt-extensions/issues/391#issuecomment-1687045699
CMD ["yarnpkg", "serve", "--port", "80"]

###############################################################################
# Build with yarn

FROM base as build

RUN yarnpkg build

###############################################################################
# Starts production nginx server

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS final

RUN \
  apt-get --quiet --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    nginx=1.22.* \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && find /var/lib/apt/lists /var/cache/apt/archives -type f -delete \
  && rm -rfv /var/cache/apt /var/lib/apt/lists /var/lib/dpkg/*-old \
  && rm -rfv /usr/share/doc /usr/share/man /usr/share/locale /usr/share/info /var/cache/apt /var/lib/apt/lists /var/lib/dpkg/*-old

COPY --from=build /app/dist /var/www/html

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]

###############################################################################
