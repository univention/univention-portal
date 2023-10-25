ARG DOCKER_PROXY

ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-505
ARG UCS_BASE_IMAGE_TAG=v0.7.5

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS local-dev-env

SHELL ["/bin/bash", "-euxo", "pipefail", "-c"]

# TODO: Installing node14 from source until the portal-frontend is migrated
# to node18 or greater.

WORKDIR /tmp
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends \
      wget=1.20.* \
      ca-certificates=202* \
      python3-distutils=3.7.* \
      make=4.2.* \
      g++=4:8.3.* \
      libssl-dev=1.1.* \
      git=1:2.20.* \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/* \
    && wget --progress=dot:giga https://nodejs.org/dist/v14.21.3/node-v14.21.3.tar.gz \
    && tar -xvf node-v14.21.3.tar.gz
WORKDIR /tmp/node-v14.21.3
RUN ./configure \
    && make "-j$(nproc)" \
    && make install \
    && rm -rf /tmp/node-v14.21.3.tar.gz /tmp/node-v14.21.3

WORKDIR /app
CMD ["/bin/bash"]


FROM local-dev-env as base
COPY ./package.json .
COPY ./yarn.lock .
# Install yarn
# hadolint ignore=DL3016
RUN npm install -g yarn
# Install dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy should come after yarn install to prevent long rebuilding time
COPY . .


# The dev-server stage is running a development server. This is intended to be
# used with the Tilt based development environment.
FROM base AS dev-server

# Define the command for the local-dev-env run in Tilt.
#
# Currently it is not possible to inject this from the Tilt configuration.
# See https://github.com/tilt-dev/tilt-extensions/issues/391#issuecomment-1687045699
CMD ["yarn", "serve", "--port", "80"]


# The test stage gives developers an easy way to run unit and ui tests
# `docker compose run --build test`
# `docker compose run --build test yarn test:e2e:headless --browser chrome`
# Still, it increases the initial build duration (due to the duplicate `yarn install`)
# TODO: Get rid of duplicate `yarn install` or separate this stage into a separate Dockerfile (e.g. test.Dockerfile)
FROM ${DOCKER_PROXY}cypress/browsers:node14.17.6-chrome100-ff98 as test

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

CMD ["yarn", "test:unit"]


FROM base as build

RUN yarn build

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS final

RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends \
      nginx=1.14.* \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY --from=build /app/dist /var/www/html
CMD ["nginx", "-g", "daemon off;"]
