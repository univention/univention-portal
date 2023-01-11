FROM library/python:3.9-slim as base

ARG WORKDIR=/app
ARG USER=fastapi
RUN useradd -m "$USER"
WORKDIR "$WORKDIR"
RUN chown "$USER":"$USER" "$WORKDIR" && \
    mkdir -p /var/local/notifications-api && \
    chown "$USER":"$USER" /var/local/notifications-api
USER "$USER"
ENV PATH="/home/${USER}/.local/bin:${PATH}"
ENV PYTHONPATH="."
ENV WEB_CONCURRENCY=1


FROM base as test
COPY ./requirements-dev.txt .
RUN pip install --no-cache-dir -r requirements-dev.txt
CMD ["pytest"]


FROM test as dev
EXPOSE 80
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "80"]


FROM base as final
ENV PYTHONPATH="$WORKDIR"

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./ ./
EXPOSE 80
ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
