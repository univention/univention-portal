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

RUN a2enmod headers \
 && a2enmod proxy \
 && a2enmod proxy_http

COPY --from=build /staging/frontend/dist /var/www/html/univention/portal
COPY ./univention-blog.png /var/www/html/univention/portal/icons/entries/univentionblog.png
COPY ./key.svg /var/www/html/univention/portal/key.svg
COPY ./login.svg /var/www/html/univention/portal/login.svg
COPY ./univention-management-console.svg /var/www/html/univention/portal/univention-management-console.svg

RUN touch /var/www/custom.css

ENTRYPOINT a2ensite univention-portal \
	&& apache2ctl -k start -DFOREGROUND
