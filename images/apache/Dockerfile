FROM node:14-buster-slim AS build

# Dear Apple M1 processor user, if the node version gets updated
# and for the purpose of development on your machine you get 
# Fatal process OOM in Failed to reserve virtual memory for CodeRange
# message, please either continue development/debugging on a different machine
# or try node version 14.
# That node can be removed when the issue doesn't persist any longer (is fixed).

WORKDIR /staging/

RUN apt-get update \
    && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
    make \
    python3 \
    g++ \
    && apt-get clean

COPY ./frontend ./frontend
COPY ./Makefile ./Makefile

RUN make

FROM debian:buster-slim AS final

SHELL ["/bin/bash", "-euxo", "pipefail", "-c"]

RUN apt-get update \
    && apt-get install  --assume-yes --verbose-versions --no-install-recommends \
    apache2 \
    apache2-utils \
    && apt-get clean

COPY --from=build /staging/frontend/dist /var/www/html
COPY ./univention-blog.png /var/www/html/univention-blog.png
COPY ./key.svg /var/www/html/key.svg
COPY ./login.svg /var/www/html/login.svg
COPY ./univention-management-console.svg /var/www/html/univention-management-console.svg

ENTRYPOINT a2enmod headers \
	&& a2ensite univention-portal \
	&& apache2ctl -k start -DFOREGROUND
