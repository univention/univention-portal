ARG DOCKER_PROXY

FROM ${DOCKER_PROXY}hadolint/hadolint:v2.7.0 as hadolint

# hadolint ignore=DL3007
FROM docker-registry.knut.univention.de/knut/pre-commit:latest as base

# Note: Installing hadolint is somewhat cumbersome.
#
# This approach is inspired by the way how the upstream project builds their
# images.
#
# Compare https://github.com/hadolint/hadolint/blob/master/docker/Dockerfile

COPY --from=hadolint /bin/hadolint /bin/hadolint
