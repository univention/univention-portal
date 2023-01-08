# Configure Keycloak

> This steps are detailed for Keycloak 19.0.1 and may be different for other versions.
> Things don't usually change too much, but it is something to keep in mind.

## Install Keycloak on UCS

To setup UCS Keycloak, you can follow the documentation
[here](https://docs.software-univention.de/keycloak-app/latest/installation.html).

## Create the client

1. Go to `Clients` on the left menu and click `Create` on the top right.
2. Name it `notifications-api` and choose `openid-connect`.
3. Now access the new client' settings and set `Access Type` to `confidential`.
4. Also in the client' settings, set `Valid Redirect URIs` to `http://localhost:8096/callback`.
5. Step 3 enabled a new tab called `Credentials` on the client' settings, access it.
6. Leave `Client Authenticator` as `Client Id and Secret`.
7. You can access the `Client Secret` here, since it will be needed for configuring the service.

## Configure the audience

JWTs can have an audience. This can help us to ensure that the token was actually ment for
our client, and we are not using a token intended for another app (Nextcloud for example).

1. Go to `Clients > notifications-api > Mappers` and click on `Create`.
2. Set the following:
   1. Name: `audience`
   2. Mapper type: `Audience`
   3. Included Client Audience: `notifications-api`
   4. Add to access token: `ON`

> This parameter can be customized, but will be expected on the JWT claims as "audience".
> The value can be configured/changed on Keycloak as well as an environment variable on our API.

## Configure attribute mapping

Given that we are using `User Federation` from UCS OpenLDAP, we will need to tweak a few
things in order to access the user's `LDAP_ID` from its JWTs claims. These are as follow:

1. Go to `Clients > notifications-api > Mappers` and click on `Create`.
2. Set the following:
   1. Name: `entryuuid`
   2. Mapper Type: `User Attribute`
   3. User Attribute: `entryuuid`
   4. Token Claim Name: `entryuuid`
   5. Claim JSON Type: `String`
   6. Add to ID token: `ON`
   7. Add to access token: `ON`
   8. Add to userinfo: `ON`

> We are using `entryuuid` to ensure consistency with the SouvAP environment, but it can
> also be customized (the JWT claim name) on Keycloak and configured as an environment
> variable in our API.

> This value will be used to filter `targetUid` on the API database.
