ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}library/python:3.9-slim as base

WORKDIR "/app"
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["pytest", "-v"]
