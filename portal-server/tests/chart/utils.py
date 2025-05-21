# SPDX-FileCopyrightText: 2024 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

from pytest_helm.utils import get_containers


def get_containers_of_job(result):
    return _get_containers_of("Job", result)


def get_containers_of_deployment(result):
    return _get_containers_of("Deployment", result)


def _get_containers_of(kind, result):
    manifest = result.get_resource(kind=kind)
    return get_containers(manifest)
