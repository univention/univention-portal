# Experiment
#
# This file builds the Debian packages of the portal in a docker container. Used
# to quickly be able to put tweaked packages together for explorative analysis.
#
# Important:
#
# This file is just putting the stuff in the current directory into a
# Debian package. This means uncomitted things and unclearn local state will all
# go into it, which is ok for explorative approaches. Please don't use this to
# build packages which you want to release. In such a case you probably want to
# start from clean sources and do it properly.



# Update the UCS image to a recent 502 environment
#
# TODO: There is probably a recent base image to start from or a smarter
# way to make one.

FROM univention/univention-corporate-server AS ucs502

COPY images/deb-build/sources.list /etc/apt/sources.list

RUN apt-get update \
  && apt-get --assume-yes upgrade \
  && apt-get clean


# Prepare the build environment and build the packages
# - install needed Debian packaging tooling
# - inject a recent node version
# - finally build the package

FROM ucs502 as build

RUN apt-get update \
  && apt-get --assume-yes install \
    git \
    build-essential \
    devscripts \
  && apt-get clean

ADD https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh /tmp/install.sh
RUN ls /root/ \
  && bash /tmp/install.sh \
  && . ~/.nvm/nvm.sh \
  && nvm install 14.21.1

RUN mkdir -p /src/debian

COPY debian /src/debian

RUN cd /src \
  && apt-get --assume-yes build-dep . \
  && rm -fr /src/debian

COPY . /src/

WORKDIR /src

RUN debchange --local work 'Private package rebuild' \
  && . ~/.nvm/nvm.sh; dpkg-buildpackage -uc -us -b -rfakeroot



# Prepare the output result, basically moving the built packages into an empty
# image so that it can be used via "--output out".

FROM scratch AS export-stage
COPY --from=build *.deb .
COPY --from=build *.buildinfo .
COPY --from=build *.changes .
