# Pointers

Collected relevant points into documentation, documents and potentially
infrastructure which is relevant for [Epic
409](https://git.knut.univention.de/groups/univention/-/epics/409).


## Environments

### SouvAP integration environment

<https://portal.dpx-univint.at-univention.de/univention/portal/#/>


This environment does contain the classic setup, this means there is a bunch of
Virtual Machines which do reflect the UCS system and there is a single node
Kubernetes cluster. The portal containers would go into this cluster.

Note: There is work on a 2nd generation deployment. The idea is that this would
be fully managed through Kubernetes. The virtual machines would be handled via
`kube-virt`.
