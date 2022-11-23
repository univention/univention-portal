ARG DOCKER_PROXY
# Constraint: Keep the python version identical to the one used in the UCS 5
# system. With the App Center integration this constraint can probably be
# removed.
FROM ${DOCKER_PROXY}python:3.7-slim-buster AS build-base

RUN apt-get -qq update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    gcc=4:8.* \
    libsasl2-dev=2.* \
    python3-dev=3.7.* \
    libldap2-dev=2.* \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /staging/
COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


FROM build-base AS build

# TODO: The debian packaging files are included by setup.py and copied due to
# this reason. This will have to be adapted once the former debian packaging will
# be removed.
COPY ./debian/changelog ./debian/changelog
COPY ./debian/control ./debian/control
COPY ./python ./python
COPY ./setup.py .

RUN pip install --no-cache-dir .


FROM build-base AS test
WORKDIR /staging/
COPY ./requirements-test.txt .
RUN pip install --no-cache-dir -r requirements-test.txt \
    && mkdir -p /var/log/univention/ \
    && touch /var/log/univention/portal.log

CMD ["pytest", "unittests"]


FROM ${DOCKER_PROXY}python:3.7-slim-buster AS final

WORKDIR /app/

COPY ./univention-portal-server /usr/sbin/univention-portal-server
COPY ./univention-portal .
COPY --from=build /usr/local/lib/python3.7 /usr/local/lib/python3.7

# TODO: We are currently baking stub files directly into the image. The content
# of the following three files will have to be provided by the environment
# eventually.
COPY ./docker/portal-server/stub_config.json /usr/lib/univention-portal/config/config.json
COPY ./docker/portal-server/stub_groups.json /var/cache/univention-portal/groups.json
COPY ./docker/portal-server/stub_portal.json /var/cache/univention-portal/portal.json

RUN apt-get update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    # libldap2-dev is required to make python-ldap work.
    # Currently this is used in the portal server to parse the DNs via "str2dn".
    libldap2-dev=2.* \
  && rm -fr /var/lib/apt/lists/* /var/cache/apt/archives/* \
  && mkdir -p /var/log/univention/ \
  && touch /var/log/univention/portal.log \
  && mkdir -p /usr/share/univention-portal \
  && python3 univention-portal add-default

EXPOSE 80

CMD ["python3", "/usr/sbin/univention-portal-server"]
