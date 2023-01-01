ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:16.3-buster-slim AS test

# TODO: Required for the cypress installation
# TODO: Cypress has more runtime dependencies, compare their documentation
RUN apt-get update -qq \
    && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
    gcc=4:8.* \
    g++=4:8.* \
    python3=3.7.* \
    make=4.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV YARN_CACHE_FOLDER=/root/.cache/yarn
