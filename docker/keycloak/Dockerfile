FROM quay.io/keycloak/keycloak:19.0.2

USER root
COPY ucs-root-ca.crt /usr/lib/jvm/jre/lib/security
WORKDIR /usr/lib/jvm/jre/lib/security
RUN keytool -keystore cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias ldapcert -file ucs-root-ca.crt
WORKDIR /opt/keycloak
USER 1001

