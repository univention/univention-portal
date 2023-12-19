ARG UCS_BASE_IMAGE_TAG=0.10.0
ARG UCS_BASE_IMAGE=gitregistry.knut.univention.de/univention/components/ucs-base-image/ucs-base-520


FROM ${UCS_BASE_IMAGE}:${UCS_BASE_IMAGE_TAG} as ucs-base

ARG WORKDIR=/app
ARG USER=fastapi
RUN useradd -m "$USER"
WORKDIR "$WORKDIR"
RUN chown "$USER":"$USER" "$WORKDIR" \
    && mkdir -p /var/local/notifications-api \
    && chown "$USER":"$USER" /var/local/notifications-api \
    && apt-get -qq update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
      libpq5=15.* \
      python3-pip=23.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*
USER "$USER"
ENV PATH="/home/${USER}/.local/bin:${PATH}"
ENV PYTHONPATH="."
ENV WEB_CONCURRENCY=1


FROM ucs-base as builder
USER root
RUN apt-get -qq update \
    && apt-get --assume-yes --verbose-versions --no-install-recommends install \
      libpq-dev=15.* \
      build-essential=12.* \
      gcc=4:12.* \
      python3-dev=3.11.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*
USER "$USER"
COPY ./requirements.txt .
RUN pip3 wheel --no-cache-dir --wheel-dir=./wheels -c requirements.txt psycopg2


FROM ucs-base as test
COPY ./requirements-dev.txt .
COPY --from=builder /app/wheels ./wheels
RUN pip3 install --break-system-packages --no-cache-dir --find-links=./wheels -r requirements-dev.txt
CMD ["pytest"]


FROM test as dev
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "app.main:app", \
    "--log-config", "logging.yaml", \
    "--reload", "--host", "0.0.0.0", "--port", "8080"]


FROM ucs-base as final
ENV PYTHONPATH="$WORKDIR"

COPY ./requirements.txt .
# TODO: RUN --mount is not yet supported in kaniko,
# See https://github.com/GoogleContainerTools/kaniko/issues/1568
# RUN --mount=type=bind,from=builder,source=/app/wheels,target=/app/wheels \
COPY --from=builder /app/wheels ./wheels
RUN pip3 install --break-system-packages --no-cache-dir --find-links=./wheels -r requirements.txt

COPY ./ ./
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "app.main:app", \
    "--log-config", "logging.yaml", \
    "--host", "0.0.0.0", "--port", "8080"]
