
ARG UCS_BASE_IMAGE_TAG=v0.7.5
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520
# OR use
# ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-505

ARG NODE_VERSION=14.21.3
ARG YARN_VERSION=1.22.1


###############################################################################
# Creates a yarn builder

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG NODE_VERSION
ARG YARN_VERSION

# The following dependencies are only needed when on an aarch64 platform,
# because then the package "deasync" does not include ready made binaries
# for the platform and falls back to compiling them.
#
# This is relevant for developers who work on machines with Apple's M1
# processors.
RUN \
  apt-get --quiet --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    curl=7.* ca-certificates=202* \
  && if [ "$(uname -m)" = "aarch64" ]; then \
      apt-get --assume-yes --verbose-versions --no-install-recommends install \
      gcc=4:8.* \
      g++=4:8.* \
      python3=3.7.* \
      make=4.* \
    ; fi \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -sL "https://unofficial-builds.nodejs.org/download/release/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64-usdt.tar.gz" | tar xz -C /usr/local --strip-components=1

## Jaime version. It works too.
##WORKDIR /tmp
##RUN apt-get update -qq \
##    && apt-get install -y --no-install-recommends \
##      wget=1.20.* \
##      ca-certificates=202* \
##      python3-distutils=3.7.* \
##      make=4.2.* \
##      g++=4:8.3.* \
##      libssl-dev=1.1.* \
##      git=1:2.20.* \
##    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* \
##    && wget --progress=dot:giga https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}.tar.gz \
##    && tar -xvf node-v14.21.3.tar.gz
##WORKDIR /tmp/node-v14.21.3
##RUN ./configure \
##    && make "-j$(nproc)" \
##    && make install \
##    && rm -rf /tmp/node-v14.21.3.tar.gz /tmp/node-v14.21.3


WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN  npm install -g "yarn@${YARN_VERSION}" \
  && yarn install --frozen-lockfile \
  && yarn cache clean

COPY . .

CMD ["/bin/bash"]

###############################################################################
# Starts a development server

# The dev-server stage is running a development server. This is intended to be
# used with the Tilt based development environment.
FROM base AS dev-server

CMD ["yarnpkg", "serve", "--port", "80"]

###############################################################################
# Runs unit tests

# The test stage gives developers an easy way to run unit and ui tests
# `docker compose run --build test`
# `docker compose run --build test yarn test:e2e:headless --browser chrome`
# Still, it increases the initial build duration (due to the duplicate `yarn install`)
# TODO: Get rid of duplicate `yarn install` or separate this stage into a separate Dockerfile (e.g. test.Dockerfile)

FROM base as test

CMD ["yarn", "test:unit"]

###############################################################################
# Build with yarn

FROM base as build

RUN yarn build

###############################################################################
# Starts production nginx server
# ucs-base-505 => nginx=1.14.*
# ucs-base-520 => nginx=1.22.*


FROM base AS final

RUN \
  apt-get --quiet --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    nginx=1.22.* \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && find /var/lib/apt/lists /var/cache/apt/archives -type f -delete \
  && rm -rfv /var/cache/apt /var/lib/apt/lists /var/log/* /var/lib/dpkg/*-old \
  && rm -rfv /usr/share/doc /usr/share/man /usr/share/locale /usr/share/info /var/cache/apt /var/lib/apt/lists /var/log /var/lib/dpkg/*-old

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]

###############################################################################
