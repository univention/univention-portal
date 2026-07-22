# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.3.0-build.20260702@sha256:8787ee424a1322ba25fa285f1840fe4bba62d7ec1f44a14a39b6e2024ad3e735
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base-python

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS build

WORKDIR /app

# A glibc-based uv binary is currently necessary for dns resolution of private pypi repos: https://github.com/astral-sh/uv/issues/8450
ADD --checksum=sha256:b26fcc8dfa1c39b5a5613445af3be3eefda45d9a39359bee271eafe34913583e \
  https://github.com/astral-sh/uv/releases/download/0.9.7/uv-x86_64-unknown-linux-gnu.tar.gz /tmp/uv.tar.gz

RUN tar -xz --strip-components=1 -C /usr/local/bin/ -f /tmp/uv.tar.gz && \
    uv venv /app/.venv && \
    uv pip install --python /app/.venv/bin/python requests


FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS final

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PATH=/app/.venv/bin:$PATH

ARG USER=loader
RUN rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/* && \
    groupadd -r ${USER} -g 1000 && \
    useradd -r -d /app -g ${USER} -N ${USER} -u 1000

COPY --from=build --chown=${USER}:${USER} /app/.venv /app/.venv
COPY --chown=${USER}:${USER} loader_udm.py .

RUN \
    python -V && \
    python -c 'import loader_udm'

USER ${USER}

ENTRYPOINT ["python", "loader_udm.py"]
