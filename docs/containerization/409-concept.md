# Implementation Concept

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



### Implementation approach and plan

Based on the Acceptance Criteria of the epic two milestones have to be achieved:

1. Deployment of the portal via HELM Charts into the Kubernetes cluster. The
   portal would have to be usable and fully functional based on the existing UCS
   instance inside of the integration environment.

2. A deployment with reduced dependencies, esp. a deployment without a full UCS
   stack. The portal will have to work based on an alternative storage backend
   and an OpenID Connect IDP (Identity Provider).

The implementation plan does focus on achieving (1) first and then catching up
to also meet (2). The main reason is that it is assumed that during the work
towards (1) the Dev Team will gain more experience with the portal and also new
insights will be generated from the work. Those will influence the specifics of
the work towards (2).


#### Milestone: Containers running inside of the SouvAP integration environment

The initial focus is on having minimal containers deployed successfully into the
SouvAP integration environment.

It is assumed that we will see missing and broken functionality during this
milestone. The aim is to prove that the communication from the web browser
(client) through all intermediate components (e.g. reverse proxy on the UCS
instance, ingress related aspects of the kubernetes cluster) towards the
portal server container is working and fully understood. This will reduce the
risk of later surprises due to wrong assumptions or misunderstanding
regarding the SouvAP integration environment.

The containers shall meet the following basic requirements:

1. It is possible to both build and run the container locally by a developer.
   Developers shall be able to do this based on a simple initial `docker
   compose` configuration.

2. The Gitlab CI pipeline is successfully building the container images.

3. It is possible to reasonably interact with the containers. We assume that
   they have already one process running inside and that is possible to
   successfully reach this process via HTTP. It is acceptable that some
   functionality is not yet working in this stage.

Compare the following implementation Issues:

- univention/components/univention-portal#546 - Backend
- univention/components/univention-portal#547 - Frontend
- univention/components/univention-portal#548 - Test suite
- TODO: add an issue regarding the notification API as stretch goal

Regarding the SouvAP integration environment and Kubernetes integration we want
to meet the following state:

1. The containers can be successfully deployed based on a HELM chart into the
   Kubernetes cluster inside of the SouvAP integration environment.

   The triggering of the HELM chart MAY be still a manual step at this point in
   time. Automation is considered for this milestone a stretch goal.

2. We have found an initial setup for developers to work on this in their local
   development environment.

3. It is possible to reach the portal frontend via HTTP and the portal frontend
   does start inside of the web browser.

Compare the following implementation Issues:

- univention/components/univention-portal#549 - Kubernetes deployment
- univention/components/univention-portal#555 - Local development environment for kubernetes
- univention/components/univention-portal#554 - Refactor current patching --
  This milestone helps to refine the approach for this Issue.


##### Implementation details regarding this milestone

During this milestone we assume that most dynamic aspects will be mocked, so
that we can reach the integration environment fast. Those mocked out aspects
will have to be worked out in the following milestones to reach the goal of this
Epic.

Already identified aspects which will most likely be initially replaced by stub
files:

- configuration files of the portal server
- update mechanisms which react to changes in the LDAP directory
- translations handling in the build process


#### Milestone: Portal functionality inside of the SouvAP integration environment

Reaching this milestone means to have the currently existing functionality of
the portal also working inside of the SouvAP integration environment. This must
be achieved based on a Kubernetes based deployment.

It is possible that we will see an integration package being installed into the
UCS instance based on the existing Debian packaging mechanism as a result of
reaching this milestone.


Issues regarding configuration and change processing:

- univention/components/univention-portal#553 - Runtime configuration
- univention/components/univention-portal#550 - Change processing of directory updates

Issues regarding authentication:

- univention/components/univention-portal#551 - Authentication
  - TODO: May need a split, for this milestone only make authentication work
    with full UCS stack. OIDC or similar pops in with the requirement to deploy
    without full UCS stack. See below.

Other issues without integration need:

- univention/components/univention-portal#563 - Translations frontend
- univention/components/univention-portal#564 - Translations backend
- univention/components/univention-portal#554 - Refactor current patching


#### TODO: Milestone: Portal can be used without a full UCS stack


Issues:

- univention/components/univention-portal#552 - Alternative datastore

- univention/components/univention-portal#551 - Authentication


#### TODO: Other and/or later milestones


Issues:

- univention/components/univention-portal#556 - Capture former decisions into ADRs
- univention/components/univention-portal#559 - Python scripts properly executable
- TODO: Container quality -- logging in all containers
- TODO: Container security / best practice -- USER instead of root


#### TODO: Clarification required

- Python packaging, dependencies and changelog
  - We use currently the tooling from the former debian package
  - Intention to use poetry
  - Clarification needed if we keep the changelog around, and if so, how to
    handle this
    - at the moment copied into the container and included via the call to setup.py
  - Dependencies are taken from  / documented in the debian/control section
    - Intention to use the proper python tooling for this

Issues:

- univention/components/univention-portal#562 - Apache VirtualHost configuration
  - TODO: needs a check against the target environment and alignment with the devops team
    - it's possible that the configuration resides on the UCS instance and the
      portal frontend container only serves out the frontend assets.


### Aspects which are currently not in focus

#### User specific configuration

Compare the Epic univention&435.

#### Reference Kubernetes configuration from SCS project

At the moment this topic can be put aside. The SCS project will eventually come
up with a specific Kubernetes configuration. At that point in the future the
container will have to be tested in this environment and potentially be adjusted
depending on the test results.

For the purpose of the concept we work on the basis of assuming a standard
Kubernetes environment.



#### App Center integration

As stated in the introduction section of this concept, the App Center
integration will happen in the future and is captured in the Epic
univention&335.

### Pointers


#### SouvAP integration environment

The integration environment can be reached via the following URL:

<https://portal.dpx-univint.at-univention.de/univention/portal/#/>

The code which produces the integration environment is available in the
following repository on Gitlab:

<https://git.knut.univention.de/univention/customers/dataport/custom/bmiux-hetzner-upgrade-automation/-/tree/master/>



### TODO

#### Prior Art





## TODO: Concept scratchpad


1. Clarification: If other backend, how does administration work?
2. Flat file interface good enough? Stub for development?
3. Q: Do we need a backend still? E.g. client reads out of S3 object store.
4. Factor out current backend -> it becomes one "object store" which provides
   the json structure
5. Would the "UCS UDM LDAP" backend become a single component which does put
   updated json files into the object store or provide the URL endpoints?
