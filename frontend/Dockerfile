ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:16.3-buster-slim AS test

# Dibya's base image
# FROM ${DOCKER_PROXY}node:14-buster-slim AS test

# RUN apt-get update -qq \
#     && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
#     gcc=4:8.* \
#     g++=4:8.* \
#     python3=3.7.* \
#     make=4.* \
#     && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

ENV YARN_CACHE_FOLDER=/root/.cache/yarn
WORKDIR /app

FROM test as build

COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build


FROM ${DOCKER_PROXY}nginx:1.23.3 AS final
COPY --from=build /app/dist /usr/share/nginx/html
