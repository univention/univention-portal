ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}cypress/browsers:node14.17.6-chrome100-ff98 AS test

WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install --frozen-lockfile && yarn cache clean

# The following copy command is needed to give developers a simple way of running tests
# docker compose run --build test
# docker compose run --build test yarn test:e2e:headless --browser chrome
# Mounting the local code into the container doesn't work because node_modules gets deleted
# See https://burnedikt.com/dockerized-node-development-and-mounting-node-volumes/
# The copy command appears after yarn install to ensure images will build fast
# Otherwise we will have to run yarn install after each change
COPY . .
CMD ["yarn", "test:unit"]


FROM test as build

RUN yarn build


FROM ${DOCKER_PROXY}nginx:1.23.3 AS final
COPY --from=build /app/dist /usr/share/nginx/html
