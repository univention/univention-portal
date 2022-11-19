# Epic 409 Clarifications

See <https://git.knut.univention.de/groups/univention/-/epics/409> regarding the Epic itself.

This section logs notes regarding various topics which we managed to clarify
during the journey or which still have to be clarified.


## Pending clarification


### TODO role of `ucs/web/theme` key

The manual states that the design can be adjusted there and refers to
`univention-web`. Are those relevant aspects here?

See
<https://docs.software-univention.de/manual/5.0/en/central-management-umc/introduction.html#creating-a-custom-theme-adjusting-the-design-of-ucswebs>



### TODO Portal authentication mode / SSO

The menu states that the UCR key `portal/auth-mode` can change how the auth mode
works.

Would this have to be migrated somehow?

Is this relevant for the 409 Epic?

See
<https://docs.software-univention.de/manual/5.0/en/central-management-umc/login.html#login>


### TODO How are "portal" and "UMC" related?

Assumption: It seems that UMC does provide tiles into the portal, depending on
the current user's permissions or groups.

The UMC is embedded via an iframe.

All requests enter through the apache server which acts as a reverse proxy in
front of everything. In Kubernetes this is somewhat comparable to the concept of
an ingress.


### TODO Does the current backend provide json structures dynamic or static?

Check also UMC


### TODO Container images and artifacts into registries

How do the artifacts arrive in the registry? Do we have to solve this part as
well or is it already solved?

## Clarified topics


### App Center

The provider manual does describe how to put an app together.

Essentially the app is based on a docker container. The app center allows to
configure the app and also provides integration with the UCS around.

There is an appliance install which does allow to install a linux system with
just the app installed. This does come with UCS included, so that the app
container has the needed ecosystem available.


#### Documentation

-   For app providers
    <https://docs.software-univention.de/app-center/5.0/en/>#


#### Example application

Etherpad Lite seems to be a good candidate for a quick test.

Source code:

-   Debian package
    <https://git.knut.univention.de/univention/components/etherpad-lite>

Conclusion: It seems to be a bad choice in a sense that it does seem to be based
on an older concept called "AppBox". This seems to be the idea to make the
container a "Managed Node" and then install the respective Debian packages into
it.


### Building the package

See developer manual at
[2. Packaging software — Univention Corporate Server - Manual for developers](https://docs.software-univention.de/developer-reference/5.0/en/packaging.html)

This is essentially the debian packaging process.


### Domain join

A normal UCS system, Managed Node, joins a domain.

Not yet sure if parts of this process are relevant to containers, or if that's
provided in a different way. It could be the responsibility of the respective
container environment to take care of those needs.

The UCS Manual states that App Center is joining containers as Managed Node into
the domain. See
<https://docs.software-univention.de/manual/5.0/en/software/app-center.html>.
