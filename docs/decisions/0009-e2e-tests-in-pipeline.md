# Running Portal End-to-end Tests in the CI pipeline


---

- status: final
- date: 2023-04-18
- deciders: dchakravorty

---

## Context

We wanted to have the portal end-to-end tests run on the CI pipeline. We are
currently considering running such a job on "merge to develop".

The end-to-end tests do QA on [two deployment paths](https://git.knut.univention.de/univention/customers/dataport/team-souvap/-/blob/master/notes/e2e-testing/ucs_vs_souvap_env.md).
This ADR is about the second deployment path, which runs a containerized portal
on a stock UCS VM.

Two potential approaches were considered:

1. Use a stock UCS VM hosted in [UVMM](https://uvmm.knut.univention.de) and
   reserved for E2E testing. The VM is long-running, and doesn't get shut down
   every night. The UCS installation is done manually and then
   a snapshot of a clean state is taken. The pipeline restores this snapshot,
   and executes the ansible patches to prepare the environment in a reproducible
   state.
2. Use a stock UCS VM running in a Kubernetes cluster (approach taken by the
   [SouvAP Devops Team](https://gitlab.souvap-univention.de/souvap/devops/deploy-souvap-ng))

## Decisions

We will use the first approach i.e. using a stock UCS VM hosted in UVMM. The
reasons are as follows.

1. This approach has relatively low complexity.
2. The majority of the knowledge to get this working is already in the team.
3. Due to the above two reasons, it can be implemented faster. This was one of
   the main criteria.
4. This approach uses the same `docker compose` based setup used by developers
   for local testing of the second deployment path.

## Rejected alternatives

We rejected the second option of using a UCS VM in the Kubernetes cluster because
of the following reasons.

1. This approach has relatively high complexity.
2. We would need much knowledge exchange with the SouvAP DevOps team to implement
   it.
3. Due to the above two reasons, this approach will be slower to implement.
4. This approach does not mirror the approach used by developers for local testing
   of the second deployment path. It mirrors the first deployment path.

## Consequences

- We will get the E2E tests running in the CI pipelines relatively fast.
- The UVMM VM exists independently of our repo, and certain things like
  UCS version has to be synced manually to what the latest repo code expects.
  However, most configuration can be managed via our Ansible scripts. This is
  not as clean as a Kubernetes-based solution, but should be good enough for
  our current needs.

## Pointers

1. [GitLab issue from which this ADR originated](https://git.knut.univention.de/univention/components/univention-portal/-/issues/659)
