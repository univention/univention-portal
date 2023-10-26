
ARG DOCKER_PROXY

ARG UCS_BASE_IMAGE_TAG=v0.7.5
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-505

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
  curl ca-certificates npm \
  && if [ "$(uname -m)" = "aarch64" ]; then \
    apt-get --assume-yes --verbose-versions --no-install-recommends install \
    gcc=4:8.* \
    g++=4:8.* \
    python3=3.7.* \
    make=4.* \
  ; fi \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN curl -sL https://unofficial-builds.nodejs.org/download/release/v14.21.3/node-v14.21.3-linux-x64-usdt.tar.gz | tar xz -C /usr/local --strip-components=1 

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
##    && wget --progress=dot:giga https://nodejs.org/dist/v14.21.3/node-v14.21.3.tar.gz \
##    && tar -xvf node-v14.21.3.tar.gz
##WORKDIR /tmp/node-v14.21.3
##RUN ./configure \
##    && make "-j$(nproc)" \
##    && make install \
##    && rm -rf /tmp/node-v14.21.3.tar.gz /tmp/node-v14.21.3


WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN  npm install -g yarn && yarn install --frozen-lockfile && yarn cache clean
##RUN yarnpkg install && yarnpkg cache clean

COPY . .

CMD ["/bin/bash"]

###############################################################################
# Starts a development server

# The dev-server stage is running a development server. This is intended to be
# used with the Tilt based development environment.
##FROM base AS dev-server

# Define the command for the local-dev-env run in Tilt.
#
# Currently it is not possible to inject this from the Tilt configuration.
# See https://github.com/tilt-dev/tilt-extensions/issues/391#issuecomment-1687045699
##CMD ["yarnpkg", "serve", "--port", "80"]

###############################################################################
# Runs unit tests

# The test stage gives developers an easy way to run unit and ui tests
# `docker compose run --build test`
# `docker compose run --build test yarn test:e2e:headless --browser chrome`
# Still, it increases the initial build duration (due to the duplicate `yarn install`)
# TODO: Get rid of duplicate `yarn install` or separate this stage into a separate Dockerfile (e.g. test.Dockerfile)
##FROM base as test

##WORKDIR /app
##COPY ./package.json .
##COPY ./yarn.lock .

##RUN yarnpkg global add node-gyp \
##  && yarn install --frozen-lockfile 
##   && yarnpkg cache clean

##COPY . .

##CMD ["yarnpkg", "test:unit"]

###############################################################################
# Build with yarn

FROM local-dev-env as build

# vzheleznyakov - Error here
RUN yarn build

###############################################################################
# Starts production nginx server

##FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS final
FROM local-dev-env AS final

RUN \
  apt-get --quiet --quiet update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    nginx=1.22.* \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  && find /var/lib/apt/lists /var/cache/apt/archives -type f -delete \
  && rm -rfv /var/cache/apt /var/lib/apt/lists /var/log/* /var/lib/dpkg/*-old \
  && rm -rfv /usr/share/doc /usr/share/man /usr/share/locale /usr/share/info /var/cache/apt /var/lib/apt/lists /var/log /var/lib/dpkg/*-old

# vzheleznyakov - Uncomment it
#COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]

###############################################################################
