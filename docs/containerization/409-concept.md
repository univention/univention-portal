# Concept Scratchpad

## Objective

> Containerization of the Univention Portal compatible to "DVS": "Deutsche
> Verwaltungscloud Strategie".
>
> Main requirements: Allow deployments of the Univention Portal on Kubernetes
> based on HELM charts.

Source: <https://git.knut.univention.de/groups/univention/-/epics/409#objective>


## Implementation Concept

This implementation concept describes on a higher level how we plan to implement
the containerization of the Univention Portal.


### About the concept


#### Scope and Context

Around the containerization we have two related but distinct Epics:

1. Epic univention&335 focuses on the integration of a containerized portal into
   the App Center. This Epic is NOT in scope of this implementation concept.

2. Epic univention&409 has a focus on the integration of a containerized portal
   into a Kubernetes based environment according to the DVS (Digitale
   Verwaltungs Strategie). This Epic is in scope of this implementation concept.

This concept has been created based on the assumption that we develop first the
Epic univention&409. We have incorporated the assumption that we will at some
point in the future also have to implement Epic univention&335.


#### Purpose

This concept shall help to align the stakeholders of an Epic around the
implementation approach. It does so by giving an overview regarding the
following questions and it shall provide pointers to the related Issues:

1. How will the containerization of the portal be technically implemented. This
   could also be called the high level design or the technical architecture.

2. Which steps to we plan to take in order to reach the objective of the Epic
   univention&409 and in order to meet its Acceptance Criteria.

We assume that the concept will evolve as we progress through the implementation
Issues of this Epic. The purpose of some Issues will be to help us gain insights
which will help to clarify open aspects of the concept.


#### Responsibility

The *Development Team* is responsible to develop and evolve the Implementation
Concept based on the Product Requirements from the Epic.



### Technical overview


#### Current UCS system

The current UCS system is based on Debian. The various components are installed
as Debian Packages. The various UCS components use mainly functionality from the
Debian packaging system to model the dependency tree and also to allow for a
composition and plug-in mechanism of various components.

The approach in this concept does take this current state into account. Details
about the architecture and implementation are documented and can be read at
<https://docs.software-univention.de/>.

We assume that the developers working on the implementation will have to make
themselves familiar with the documentation in the section "Developers".
Especially the following two documents:

1. Manual for developers
   <https://docs.software-univention.de/developer-reference/5.0/en/>

2. Univention Corporate Server Architecture
   <https://docs.software-univention.de/architecture/5.0/en/>


#### SouvAP Integration Environment

The current classic [deployment
environment](#souvap-integration-environment-1) looks roughly as
follows:

![SouvAP classic](./images/souvap-classic-deployment.png)

Source:
[Souvereign Workplace (SouvAP).pptx](https://filestore.knut.univention.de/owncloud/f/3931975)

This environment does contain the classic setup as shown above, this means there
is a bunch of Virtual Machines which do reflect the UCS system and there is a
single node Kubernetes cluster. The portal containers would go into this
Kubernetes cluster.

Note: There is work on a 2nd generation deployment. The idea is that this would
be fully managed through Kubernetes. The virtual machines would be handled via
`kube-virt`. See the presentation linked above regarding more details.

It is assumed that this will have no impact on this concept.



### Pointers


#### SouvAP integration environment

The integration environment can be reached via the following URL:

<https://portal.dpx-univint.at-univention.de/univention/portal/#/>

The code which produces the integration environment is available in the
following repository on Gitlab:

<https://git.knut.univention.de/univention/customers/dataport/custom/bmiux-hetzner-upgrade-automation/-/tree/master/>



### TODO

#### Prior Art





## Concept scratchpad

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


### TODO UCS manual adjustments

Are they needed as part of the Epic 409?

Compare
<https://docs.software-univention.de/manual/5.0/en/central-management-umc/index.html>


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

The UCS Manual states that App Center is joining containers as Managed Node into
the domain. See
<https://docs.software-univention.de/manual/5.0/en/software/app-center.html>.
