# Concept Scratchpad

## Objective

> Containerization of the Univention Portal compatible to "DVS": "Deutsche
> Verwaltungscloud Strategie".
>
> Main requirements: Allow deployments of the Univention Portal on Kubernetes
> based on HELM charts.

Source: <https://git.knut.univention.de/groups/univention/-/epics/409#objective>


## Planning

Preparing for figuring out reasonable steps to reach the goal.


### Container for portal-backend

Compare
[Issue #1](https://git.knut.univention.de/univention/components/univention-portal/-/issues/1).

TODO: Capture background of issue details from fbest. The details contain
implicit design decisions, once the background is found out we should capture
those into a note (or ADR if we do those).

TODO: Find out if there are any constraints which we don't know yet from the UCS
system context. E.g. UCS comes with a promise of quite long term support. This
is probably possible due to its basis on supported Debian packages. A container
build which runs a `pip install` to create the image does expand these
requirements towards packages on pypi, node registry for the frontend and
potentially other sources. Without taking any measures it may be challenging /
impossible to run the build process again in a distant future.


### Container for portal-frontend

Compare
[Issue #2](https://git.knut.univention.de/univention/components/univention-portal/-/issues/2).

TODO: Capture background of issue details from fbest. Capture into note or ADR.

TODO: UCS configuration integration potentially into a separate step, not yet
sure how tricky it is.

TODO: If we do ADRs, then log the design decision that the reverse proxy is in
charge now for the paths and the portal changes in that regard. I've seen this
in the code but not understood why it has been done.



### Configuration of Paths for the portal (UCM)

Compare the epic description of
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).

> Abbilden verschiedener URLs/Pfade unter denen das Portal content ausliefert
>
> Pfade müssen auf dem Host für den Reverse Proxy und im Backend Container für die
> Unterscheidung welche Inhalte ausgeliefert werden bekannt sein
>
> Aktuell gibt es ein UCR Modul zum Erstellen von Symlinks für Apache-Targets und
> eine Auswertung der UCR-Variablen im Backend. Marker: hier stehen wir in der
> Absprache Dirk/Florian/Arvid/Pawel/Ingo



### Unittest integration into CI pipeline

Compare
[Issue 4](https://git.knut.univention.de/univention/components/univention-portal/-/issues/4)

We would have an early benefit as soon as we touch the portal code.


### Change processing (Listener / UDM)

Compare
[Issue #5](https://git.knut.univention.de/univention/components/univention-portal/-/issues/2).

TODO: We have to find out what is already there, it seems to be inside the app
center form. Not sure if anything has been captured in the repository so far.

TODO: If we should go for ADRs, then we should log a note about the decision
to use the App Center listener mechanism.



### Portal can be deployed into Kubernetes

Make it possible, that the portal can be deployed into the following
environment:

1. Kubernetes
   - The portal is running in one or multiple containers
   - The portal can reach the components of the UCS stack via network

This does not contain needed modifications so that the portal can run without a
full UCS stack.



### Portal can be deployed into App Center

Make it possible, that the portal can be deployed into the following
environment:

1. App Center
   - The portal is running in one or multiple containers
   - The portal can reach the components of the UCS stack via network

This does not contain needed modifications so that the portal can run without a
full UCS stack.

Compare
[Issue 3](https://git.knut.univention.de/univention/components/univention-portal/-/issues/3).


### UCS migration path from Debian Package to App Center

Upgrading a current UCS system would have to replace the portal from a Debian
package based deployment into an App Center based deployment.



### UMC connection

TODO: Needs refinement, currently not clear what this is about.

From
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335):

> Limitierung im UMC-Server, dass sessions von ::1 / 127.0.0.1 übernommen werden
> können aufweichen?
>
> UMC-URL konfigurierbar machen?
>
>
> oder OIDC Implementieren?
>
> -> initial sollte der bestehende Ablauf beibehalten werden, das sollte über das
> App Center auf UCS möglich sein. In einem eigenen späteren Epic: Für ein
> Deployment ausserhalb von UCS / in verteilten Umgebungen ist ein SSO per OIDC an
> sowohl Portal als auch UMC notwendig und dann eine Umsetzung des Austausch
> zwischen Portal und UMC (Ermitteln der dem User anzuzeigenden Kacheln) ähnlich
> der Filepicker-Integration zwischen OX und Nextcloud durch ein SSO zwischen den
> Backends (evtl. über den Intercom Service?).



### Portal can run without a full UCS stack

This modifies the portal, so that it can run based on an alternative backend.



### Integration with SouvAP environment

Currently the automated deployment does apply quite a few patches regarding the
portal in order to integrate it.

Assumption: This has to be somehow adapted into the container based deployment.

The sources of the ansible script can be inspected here:
<https://git.knut.univention.de/univention/customers/dataport/custom/bmiux-hetzner-upgrade-automation/-/blob/master/iam_ucs_portal.yml>



### Capture logging decision in ADR

Assumed that we do ADRs, then we should capture:

> Log rotation? Nur noch nach stderr loggen? Wie bei Scripten, die durch listener
> ausgeführt werden?
>
> -> Cotainer sollten ihre Logs immer an den Host "abliefern", der Host / eine
> Implementierung des App Centers auf dem Host muss sich um das Handling der Logs
> kümmern. Implementierungsbedarf dazu muss in ein eigenes Epic gehen.

Source:
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).



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
