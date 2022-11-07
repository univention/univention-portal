
# 409 Planning

Planning preparation for
[Epic 409](https://git.knut.univention.de/groups/univention/-/epics/409).



## Genral assumptions

1. We go with a focus on Epic 409, which means that containers into
   the SouvAP Kubernetes environment is our main focus.
2. The work for Epic 335 can be put aside for now.
3. Cleanup is no problem once the containers are there.
   (Currently the portal is deployed into SouvAP as a Debian package.)




## Container for portal-backend

The portal backend is running inside of a container.

AC:

- It's possible to build and run the container via `docker compose`.
- The gitlab ci pipeline is building the container image on every push to the branch.
- API endpoints of the portal can be reached.




## Container for portal-frontend

The portal frontend is running inside of a container.

AC:

- It's possible to build and run the container via `docker compose`.
- The gitlab ci pipeline is building the container image on every push to the branch.
- The frontend can be opened from a web browser.




## Unittest integration into CI pipeline

Existing tests of the portal backend and frontend are executed during the container build. Or it is alternatively possible to run them inside of a testing container.

AC:

- The tests are executed in the CI pipeline
- It is possible to trigger the test run through `docker compose`




## Portal can be deployed into Kubernetes

It is possible to deploy the portal into a Kubernetes cluster based on a HELM chart.

AC:

- Deployment into the Kubernetes cluster of SouvAP is possible.
- (stretch) Deployment into a local / dev Kubernestes cluster is possible.
- The portal frontend can be reached via web browser.
  - it may be that it shows only limited functionality due to missing integrations
- The portal frontend can reach the portal backend within the cluster.




## Change processing (Listener mechanism)

Note: This one probably needs refinement and Architecture Decisions!

Changes in the directory (LDAP) are propagated into the portal.

AC:

- A portal entry is shown in the portal after it has been added into the directory.


Additional information:

Compare
[Issue #5](https://git.knut.univention.de/univention/components/univention-portal/-/issues/5). It may help to understand what has to be covered. The code is in the folder `/app` within the containerization branch of the repository. The App Center integration itself is not present in the Kubernetes cluster. So a queue based mechanism probably will have to be added.

- A vision document
  https://filestore.knut.univention.de/owncloud/f/1103562
- https://projects.univention.de/xwiki/wiki/upx/view/UPX%20IAM/
- UMC container prototype (potentially dated)
  https://git.knut.univention.de/univention/customers/dataport/upx/container-umc





## "Single Sign On" (UMC connection)

It is possible to use the portal without a full UCS stack being available. The portal allows to sign in based on OIDC via the existing IDP (Identity Provider).

AC:

- Given that the portal has been deployed into the SouvAP Kubernetes cluster, I can login to the portal.






## Portal can run with an alternative datastore

This modifies the portal, so that it can run based on an alternative backend and without the full UCS stack being available.

TODO: Needs refinement







## Refactor: Integration with SouvAP environment

Currently the automated deployment does apply quite a few patches regarding the
portal in order to integrate it. Those patches are applied on the file system of the UCS host.

Assumption: This has to be somehow adapted into the container based deployment.

Additional information:

The sources of the ansible script can be inspected here:
<https://git.knut.univention.de/univention/customers/dataport/custom/bmiux-hetzner-upgrade-automation/-/blob/master/iam_ucs_portal.yml>






------ TODO ------- Clarify, decide etc. --------



## Dev / Test environment

We need some way to test our development. Probably we cannot play all at the same time in our one integration environment.

An approach could be to put a single node cluster into our regular UCS VMs and work based on that. Might be good enough for the need.

Adaptations for this could be captured in Ansible.



## Self-Service

It's running in the portal, do we get any special requirements due to that?





------ TODO ------- Capture former decisions --------





## Capture logging decision in ADR

Assumed that we do ADRs, then we should capture:

> Log rotation? Nur noch nach stderr loggen? Wie bei Scripten, die durch listener
> ausgeführt werden?
>
> -> Cotainer sollten ihre Logs immer an den Host "abliefern", der Host / eine
> Implementierung des App Centers auf dem Host muss sich um das Handling der Logs
> kümmern. Implementierungsbedarf dazu muss in ein eigenes Epic gehen.

Source:
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).




## Capture OIDC decision in ADR

Assumed that we do ADRs, then we should capture:

The portal is integrated via OIDC to be able to run without a full UCS stack.







## References


Contains also heavily input from
[Epic 335](https://git.knut.univention.de/groups/univention/-/epics/335).

Notes captured during the preparation

https://git.knut.univention.de/univention/components/univention-portal/-/blob/jbornhold/409-concept-and-planning/docs/containerization/409-planning.md
