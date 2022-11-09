ARG DOCKER_PROXY
FROM ${DOCKER_PROXY}python:3.7-slim-buster AS build

# Build the dependencies
# 1. install system packages needed for the build
# 2. build the python dependencies
RUN apt-get -qq update \
  && apt-get --assume-yes --no-install-recommends install \
    gcc \
    libsasl2-dev \
    python3-dev \
    libldap2-dev \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /staging/
COPY ./requirements.txt .
RUN pip install -r requirements.txt


# Build the application
#
# Note: The debian packaging files are included by setup.py and copied due to
# this reason. This will have to be adapted once the former debian packaging will
# be removed.
COPY ./debian/changelog ./debian/changelog
COPY ./debian/control ./debian/control
COPY ./python ./python
COPY ./setup.py .

RUN pip install .


FROM ${DOCKER_PROXY}python:3.7-slim-buster AS final

WORKDIR /app/

COPY ./images/portal-server/entrypoint.sh ./bin/
COPY ./univention-portal-server /usr/sbin/univention-portal-server
COPY ./conffiles/usr ./conffiles/usr
COPY ./listener ./listener
COPY ./univention-portal .
COPY --from=build /usr/local/lib/python3.7 /usr/local/lib/python3.7

RUN apt-get update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    # Note: libldap2-dev required to make python-ldap work.
    libldap2-dev \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN mkdir -p /var/log/univention/ \
  && touch /var/log/univention/portal.log \
  && mkdir -p /usr/share/univention-portal \
  && mkdir -p /var/cache/univention-portal

RUN python3 univention-portal add-default \
  && python3 univention-portal add-umc-default


ENTRYPOINT ["./bin/entrypoint.sh"]
CMD ["python3", "/usr/sbin/univention-portal-server"]
