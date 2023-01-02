ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:14-buster-slim AS test

WORKDIR /frontend
COPY . .

RUN yarn install && yarn cache clean

CMD ["yarn", "test:unit"]


FROM test as build

RUN yarn build


FROM ${DOCKER_PROXY}nginx:1.23.3 AS final
COPY --from=build /frontend/dist /usr/share/nginx/html
