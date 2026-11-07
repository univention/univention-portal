# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261106@sha256:f4e537e49d316d4a744ca7c2f11ab11936993811bf0ed76a6bd0414ed03f03bc AS build

# UID 1000 cannot write to /app. The final stage runs as 1000 again.
# hadolint ignore=DL3002
USER 0

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.13.7@sha256:96f40d3904aad8d0bd010539001d36c8e2188b981e1334471a90c4a1d93bb490 /uv /usr/local/bin/uv

# The final stage has only the system CPython, not a Python downloaded by uv.
ENV UV_PYTHON_DOWNLOADS=never \
    UV_NO_CACHE=1

COPY pyproject.toml uv.lock ./

RUN ["uv", "sync", "--locked", "--no-dev"]


FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261106@sha256:f4e537e49d316d4a744ca7c2f11ab11936993811bf0ed76a6bd0414ed03f03bc AS final

ENV PATH=/app/.venv/bin:$PATH

WORKDIR /app

COPY --from=build --chown=1000:1000 /app/.venv /app/.venv
COPY --chown=1000:1000 loader_udm.py .

RUN ["python", "-c", "import loader_udm"]

ENTRYPOINT ["python", "loader_udm.py"]
