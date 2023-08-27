FROM ${DOCKER_PROXY}debian:bookworm-slim

RUN apt-get update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
      curl=7.88.* \
      ldap-utils=2.5.* \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*
