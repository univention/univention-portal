# SPDX-FileCopyrightText: 2024 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only


def get_containers_of_job(result):
    return _get_containers_of("Job", result)


def get_containers_of_deployment(result):
    return _get_containers_of("Deployment", result)


def _get_containers_of(kind, result):
    manifest = result.get_resource(kind=kind)
    init_containers = manifest.findone("spec.template.spec.initContainers")
    containers = manifest.findone("spec.template.spec.containers")
    return init_containers + containers
