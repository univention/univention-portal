ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}cypress/browsers:node14.17.6-chrome100-ff98 AS base

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean


FROM base as test

COPY . .
CMD ["yarn", "test:unit"]


FROM test as build

RUN yarn build


FROM ${DOCKER_PROXY}nginx:1.23.3 AS final
COPY --from=build /app/dist /usr/share/nginx/html
