ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}library/nginx:1.23.3

COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf.template /etc/nginx/templates/
COPY ssl /etc/nginx/ssl/
