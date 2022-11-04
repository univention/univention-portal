# Concept Scratchpad

## Objective

> Containerization of the Univention Portal compatible to "DVS": "Deutsche
> Verwaltungscloud Strategie".
>
> Main requirements: Allow deployments of the Univention Portal on Kubernetes
> based on HELM charts.

Source: <https://git.knut.univention.de/groups/univention/-/epics/409#objective>


## Concept scratchpad

Q: Split "container" and "backend" as work areas.

Preparatory steps:

1. Current portal as package -- somehow
2. Container with installed current portal
   - alt: above VM for the first steps
   - head to container once understanding deep enough
3. Verify that we have all dependencies understood
   - Precondition: Portal running isolated without any of it's dependencies
   - add known dependencies
   - verify it's working
     - Note: Find out what "working" means, later we would need this knowledge
       anyway for testing
   - update concept / plan based on insights

Container steps:

1. Portal into container, roughly "as-is"
   - assumption: Debian based base image, install DEB package, done.
   - tweaking, so that the portal uses the dependencies from the host (via network)
   - insights will help to refine the future steps
2. Deployment via HELM
   - Note: Targeting K8S
   - Note: Insights from previous steps needed
3. Deployment into SCS
   - Fallback: Plain K8S until SCS is fully understood and available
4. Split container into portal app and backend - overlap with backend steps below
   - Note: May come earlier, may overlap with dev env container

Q: How does UCS stack know that it must notify the container?

Backend steps: (only questions so far)

1. Clarification: If other backend, how does administration work?
2. Flat file interface good enough? Stub for development?
3. Q: Do we need a backend still? E.g. client reads out of S3 object store.
4. Factor out current backend -> it becomes one "object store" which provides
   the json structure
5. Would the "UCS UDM LDAP" backend become a single component which does put
   updated json files into the object store or provide the URL endpoints?

## Clarify


### TODO How are "portal" and "UMC" related?

Assumption: It seems that UMC does provide tiles into the portal, depending on
the current user's permissions or groups.


### TODO Does the current backend provide json structures dynamic or static?

Check also UMC


### TODO Container images and artifacts into registries

How do the artifacts arrive in the registry? Do we have to solve this part as
well or is it already solved?


### TODO How to get a "SCS based Kubernetes"

Speak trossner

This is the target platform, how can we test on it?


### TODO Other requirements

Speak isteuwer

Compare 335:

-   Deployment via Univention App Center
-   Deployment as native Docker

Are those still relevant? Somehow the existing customer basis still has to be
supported.


## Research


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
