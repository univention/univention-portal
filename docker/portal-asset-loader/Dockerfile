# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261126@sha256:945bf65926722353a98b8fe28ed66e2d4519fdc9c6b661ab98c5c662126334a1 AS build

# UID 1000 cannot write to /app. The final stage runs as 1000 again.
# hadolint ignore=DL3002
USER 0

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.13.8@sha256:5cc1805e2426484abca4ad46ea783bab281fdb225fd82d8ce6d66a81254bac85 /uv /usr/local/bin/uv

# The final stage has only the system CPython, not a Python downloaded by uv.
ENV UV_PYTHON_DOWNLOADS=never \
    UV_NO_CACHE=1

COPY pyproject.toml uv.lock ./

RUN ["uv", "sync", "--locked", "--no-dev"]


FROM gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-distroless-python:5.3.0-build.20261126@sha256:945bf65926722353a98b8fe28ed66e2d4519fdc9c6b661ab98c5c662126334a1 AS final

ENV PATH=/app/.venv/bin:$PATH

WORKDIR /app

COPY --from=build --chown=1000:1000 /app/.venv /app/.venv
COPY --chown=1000:1000 loader_udm.py .

RUN ["python", "-c", "import loader_udm"]

ENTRYPOINT ["python", "loader_udm.py"]
