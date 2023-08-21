ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}library/node:14-buster-slim AS local-dev-env

# The following dependencies are only needed when on an aarch64 platform,
# because then the package "deasync" does not include ready made binaries
# for the platform and falls back to compiling them.
#
# This is relevant for developers who work on machines with Apple's M1
# processors.
RUN if [ "$(uname -m)" != "aarch64" ]; then exit 0; fi && \
    apt-get update -qq \
    && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
    gcc=4:8.* \
    g++=4:8.* \
    python3=3.7.* \
    make=4.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /app
CMD ["/bin/bash"]


FROM local-dev-env as base
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

# Copy should come after yarn install to prevent long rebuilding time
COPY . .


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


FROM ${DOCKER_PROXY}library/nginx:1.23.3 AS final
COPY --from=build /app/dist /usr/share/nginx/html
