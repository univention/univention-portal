FROM python:3.9-slim as dev
ARG WORKDIR
ARG USER=fastapi
ENV POETRY_VERSION=1.2.0 \
    POETRY_VIRTUALENVS_CREATE=true
RUN echo $POETRY_VERSION
RUN pip install -U --no-cache-dir pip && \
    pip install --no-cache-dir "poetry==$POETRY_VERSION"
RUN useradd -m "$USER"
WORKDIR "$WORKDIR"
RUN chown "$USER":"$USER" "$WORKDIR"
USER "$USER"
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-root --no-interaction --no-ansi
RUN ln -s $(poetry env info --path) "/home/${USER}/venv"
ENV PATH="/home/${USER}/venv/bin:${PATH}"
ENV PYTHONPATH="$WORKDIR"
COPY ./ "$WORKDIR"
EXPOSE 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
