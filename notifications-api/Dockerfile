FROM python:3.9-slim as dev
ENV POETRY_VERSION=1.2.0
RUN pip install -U --no-cache-dir pip && \
    pip install --no-cache-dir "poetry==$POETRY_VERSION" && poetry config virtualenvs.create false
COPY pyproject.toml poetry.lock* ./
RUN poetry install --no-interaction --no-ansi
ADD app app
EXPOSE 8001:80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
