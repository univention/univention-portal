ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}node:14-buster-slim AS build

WORKDIR /frontend
COPY ./frontend .

RUN yarn install && yarn build

COPY ./univention-blog.png ./dist/univention-blog.png
COPY ./key.svg ./dist/key.svg
COPY ./login.svg ./dist/login.svg
COPY ./univention-management-console.svg ./dist/univention-management-console.svg
RUN echo "{}" > ./dist/i18n/de.json

FROM ${DOCKER_PROXY}debian:buster-slim AS final

RUN apt-get update -qq \
    && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
    apache2=2.* \
    apache2-utils=2.* \
    && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

COPY --from=build /frontend/dist /var/www/html
RUN a2enmod headers

EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]
