ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:14-buster-slim AS test

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
