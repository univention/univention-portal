FROM debian:buster
ARG DEBIAN_FRONTEND=noninteractive

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get --assume-yes install curl openssh-client
# cypress dependencies for running electron
RUN apt-get install --assume-yes libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
&& echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 14.17.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash - \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && nvm current

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

COPY sources.list /etc/apt/sources.list.d/15_ucs-online-version.list
RUN \
  set -euxo pipefail && \
  echo 'nameserver 192.168.0.97' > /etc/resolv.conf && \
  printf -v URL '%s' \
    'https://updates.software-univention.de/' \
    'univention-archive-key-ucs-5x.gpg' && \
  curl -fsSL "${URL}" | apt-key add - && \
  apt-get update && \
  apt-get --assume-yes --verbose-versions --no-install-recommends install \
    univention-l10n-dev devscripts debhelper nodejs yarn build-essential && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /tmpinstall/
RUN yarn add --dev cypress

WORKDIR /debbuilder/
ENV NODE_ENV=sandbox

