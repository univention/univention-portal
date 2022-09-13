FROM python:3.7-slim-buster AS build

WORKDIR /staging/

COPY ./debian/changelog ./debian/changelog
COPY ./debian/control ./debian/control
COPY ./python ./python
COPY ./requirements.txt .
COPY ./setup.py .

RUN apt-get update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    ca-certificates \
    curl \
    gpg \
    gpg-agent \
    gcc \
    libsasl2-dev \
    python3-dev \
    libldap2-dev \
  && apt-get clean

RUN pip install -r requirements.txt \
  && pip install .

FROM python:3.7-slim-buster AS final

WORKDIR /app/

COPY ./univention-portal-server /usr/sbin/univention-portal-server
COPY ./conffiles/usr ./conffiles/usr
COPY ./listener ./listener
COPY ./udm ./udm
COPY ./univention-portal .
COPY --from=build /usr/local/lib/python3.7 /usr/local/lib/python3.7

RUN apt-get update \
  && apt-get --assume-yes --verbose-versions --no-install-recommends install \
    libldap2-dev \
  && apt-get clean

RUN mkdir -p /var/log/univention/ \
  && touch /var/log/univention/portal.log

RUN mkdir -p /usr/share/univention-portal

ENTRYPOINT python univention-portal add-default \
  && python univention-portal update \
  && python /usr/sbin/univention-portal-server
