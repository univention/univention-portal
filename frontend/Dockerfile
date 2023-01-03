ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:14-buster-slim AS base

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

# The test stage gives developers an easy way to run unit and ui tests
# `docker compose run --build test`
# `docker compose run --build test yarn test:e2e:headless --browser chrome`
# Still, it increases the initial build duration (due to the duplicate `yarn install`)
# TODO: Get rid of duplicate `yarn install` or separate this stage into a separate Dockerfile (e.g. test.Dockerfile)
FROM ${DOCKER_PROXY}cypress/browsers:node14.17.6-chrome100-ff98 as test

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

CMD ["yarn", "test:unit"]


FROM base as build

RUN yarn build


FROM ${DOCKER_PROXY}nginx:1.23.3 AS final
COPY --from=build /app/dist /usr/share/nginx/html
