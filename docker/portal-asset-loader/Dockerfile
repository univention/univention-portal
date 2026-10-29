# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

ARG UCS_BASE_IMAGE_TAG=5.3.0-build.20261026@sha256:6eae72e522f58da1b0dce75f38eddc7ed725ec5fc235929abca8079256475eb5
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base-python
ARG UCS_DISTROLESS_IMAGE_TAG=5.3.0-build.20261026@sha256:f65cefc852c76dfd42ad0c1ad0f6885357e62899f51aa421b6f89eef550b97cf
ARG UCS_DISTROLESS_IMAGE=gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python

FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} AS build

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.13.6@sha256:af22a52f5eafef3d78e551599d405c02df61919d18028f0cea8eda93bc9986d0 /uv /usr/local/bin/uv

# The venv has to use the system CPython, which the distroless image provides at the same path.
ENV UV_PYTHON_DOWNLOADS=never

COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-dev


FROM ${UCS_DISTROLESS_IMAGE}:${UCS_DISTROLESS_IMAGE_TAG} AS final

WORKDIR /app

COPY --from=build --chown=1000:1000 /app/.venv /app/.venv
COPY --chown=1000:1000 loader_udm.py .

RUN ["/app/.venv/bin/python", "-c", "import loader_udm"]

ENTRYPOINT ["/app/.venv/bin/python", "/app/loader_udm.py"]
