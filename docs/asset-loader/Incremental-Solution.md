# Incremental solution

It's important that the solution can be implemented in many incremental stages and that pausing / aborting the project in the middle still gives a better result than the starting point / previous stages.

## Context

1st separate the responsibilities of the portal-consumer:

- Serve static files publicly (.svg images ...) (currently S3).
- Write the portal config to a database (currently S3) when updated in LDAP.
- Construct a nested group cache in groups.json

Priorities:

1. Stop relying on Ingress-Nginx Path rewrites for static assets (.svg images ...)
2. Remove the S3 / Minio dependency.

## Milestone 1: Serve portal-assets differently
effort: small

Configurable static files should be served like other static files.
By the portal-frontend Nginx or the UMC frontend Apache web server.

The Nginx of the Portal Frontend is the perfect place.
How do the assets get from LDAP Database to the Nginx container?

Small sidecar container that:
1. Loads all assets at startup
2. Polls the LDAP subtree entryCSN for changes.
2. Reloads all assets from UDM.
(The current portal-consumer also does a full resync on any change)

If / When we switch to PostgreSQL for the Portal config, we can easily switch this simple loader from LDAP to PostgreSQL.

-> Customer Value: No ingress-nginx dependency. (High-priority for customers, actively requested/required by openDesk 13)
-> Developer Value: Simpler portal assets data flow. Fewer responsibilities of the Portal Consumer.


## Milestone 2: remove S3 Dependency
effort: small

In the short-term we need to save the portal.json blob and groups.json blob in a different location.
Medium-Term, we can write the blobs either to NATS or PostgreSQL.

This removes the complicated S3 Dependency with limited effort.

-> Customer Value: Removed dependency on external S3 storage.
Lowers the cost of operating Nubus.
Eliminates the need to find a replacement for Minio
(Actively requested by openDesk 8)

-> Developer Value: Removes testing, maintenance and documentation requirements of S3.
Both NATS KV and PostgreSQL are existing Nubus dependencies
and have significantly smaller testing, maintenance and documentation overhead compared to S3.


## Milestone 3: New group cache
effort: small

Migrate the group cache to structured data.

Instead of writing a json blob, we want to save the nested group map as structured data.
In a KV Store or SQL Database.

-> Customer Value: Better group cache performance (moderate, 2) Smaller database writes, Lower database load. (small, 1)
-> Developer Value: Better data schema. (small) More easily usable by other components. (small)


## Milestone 3A: Rearchitected group cache
effort: medium/large

Integrate the group cache and into LDAP.
An LDAP overlay maintains a nestedGroups field on the User object.

-> Customer Value:
- More performant group cache, natively maintained in the Database. (2)
- nestedGroups field can be accessed and evaluated by Keycloak (13)
- nestedGroups field can be evaluated by third-party Software like Nextcloud, OX...
Either via an LDAP lookup or mapped in the OIDC token by Keycloak

-> Developer Value:
- More performant group cache, usable by all Univention aplications.
- Group cache is always in sync with the rest of the LDAP data.

## Milestone 4:
effort: medium

The Portal Server reads the portal config directly from LDAP/UDM.

The Portal Server python process has an asyncio background process that:
1. Loads all assets at startup
2. Polls the LDAP subtree entryCSN for changes.
2. Loads the new config from UDM.
