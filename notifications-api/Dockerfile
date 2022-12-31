FROM python:3.9-slim as test

ARG WORKDIR=/app
ARG USER=fastapi
ENV POETRY_VERSION=1.2.0 \
    POETRY_VIRTUALENVS_CREATE=true
RUN pip install -U --no-cache-dir pip==22.3.1 && \
    pip install --no-cache-dir "poetry==$POETRY_VERSION" && \
    useradd -m "$USER"
WORKDIR "$WORKDIR"
RUN chown "$USER":"$USER" "$WORKDIR"
USER "$USER"
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-root --no-interaction --no-ansi && \
    ln -s "$(poetry env info --path)" "/home/${USER}/venv"
ENV PATH="/home/${USER}/venv/bin:${PATH}"
ENV PYTHONPATH="."
CMD ["pytest"]


FROM test as dev

ENV PYTHONPATH="$WORKDIR"
COPY ./ ./
EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
