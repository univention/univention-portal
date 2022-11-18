FROM python:3.9-slim as builder
WORKDIR /app
ENV POETRY_VERSION=1.2.0
RUN pip install -U --no-cache-dir pip==22.0.4 && \
    pip install --no-cache-dir "poetry==$POETRY_VERSION" && poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-interaction --no-ansi
COPY app app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]

FROM builder as dev
RUN poetry install --no-interaction --no-ansi --with dev
COPY tests tests
