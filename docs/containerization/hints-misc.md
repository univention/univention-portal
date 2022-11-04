# Misc hints

This area captures insights from the analysis and exploration which might be
useful for team members in general.

The right place for those still has to be found. Then they should be migrated to
that place and removed here.


## SSH Agent forwarding

When working on your VM you might want to clone or push to git repositories via
SSH. Using agent forwarding helps to avoid that you have to place your private
key into your VM:

    ssh -A ${YOUR_USERNAME_ON_VM}@${YOUR_VM_ADDRESS}

This should allow to operate with commands like `git clone` or `git push`.


## VM user using Docker

The user has to be in the group `docker`.

    usermod -a -G docker ${YOUR_USERNAME_ON_VM}

Note: You may have to use a fresh login to see the effect.

Note: Probably this approach should be done in a different way on a UCS system.


## Configure git

    git config --global user.name "Johannes Bornhold"
    git config --global user.email johannes.bornhold.extern@univention.de

## Building the containers

There notes are regarding the branch
[`jbornhold/409-exploration-wip`](https://git.knut.univention.de/univention/components/univention-portal/-/refs/switch?destination=tree&ref=jbornhold%2F409-exploration-wip).

Managed to build the container images based on the following commands:

    docker build --platform=amd64 -f images/portal-server/Dockerfile .
    docker build --platform=amd64 -f images/apache/Dockerfile .

The important aspect is to include `--platform=amd64` so that it uses the
matching architecture of the base image. Otherwise the univention packages will
not all be available.


## Configure your meeting settings

There is a setting to allow all to become presenters, that's making it easier to
collaborate and quickly share a screen.

Otherwise people have to ask the owner of the room to be made presenter which
can slow down the meeting flow drastically.

Can be done via the room settings on <https://talk.univention.de>.
