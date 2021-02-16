FROM debian:buster
ARG DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y curl devscripts debhelper
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs &&  \
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
&& echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
&& apt-get update && apt-get install yarn

WORKDIR /debbuilder/
ENV NODE_ENV=sandbox
#CMD yarn --cwd=frontend && yarn --cwd=frontend build && apt-get -q --assume-yes build-dep . && dpkg-buildpackage -uc -us -b  && cp ../*.deb .
