# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261026@sha256:f65cefc852c76dfd42ad0c1ad0f6885357e62899f51aa421b6f89eef550b97cf AS build

# UID 1000 cannot write to /app. The final stage runs as 1000 again.
# hadolint ignore=DL3002
USER 0

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.13.6@sha256:af22a52f5eafef3d78e551599d405c02df61919d18028f0cea8eda93bc9986d0 /uv /usr/local/bin/uv

# The final stage has only the system CPython, not a Python downloaded by uv.
ENV UV_PYTHON_DOWNLOADS=never \
    UV_NO_CACHE=1

COPY pyproject.toml uv.lock ./

RUN ["uv", "sync", "--locked", "--no-dev"]


FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261026@sha256:f65cefc852c76dfd42ad0c1ad0f6885357e62899f51aa421b6f89eef550b97cf AS final

ENV PATH=/app/.venv/bin:$PATH

WORKDIR /app

COPY --from=build --chown=1000:1000 /app/.venv /app/.venv
COPY --chown=1000:1000 loader_udm.py .

RUN ["python", "-c", "import loader_udm"]

ENTRYPOINT ["python", "loader_udm.py"]
