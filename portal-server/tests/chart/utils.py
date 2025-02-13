# SPDX-FileCopyrightText: 2024 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

import jsonpath


def findone(data, path):
    return jsonpath.match(path, data).obj


def findall(data, path):
    return jsonpath.match(path, data).obj


def get_containers_of_job(helm, result):
    return _get_containers_of("Job", helm, result)


def get_containers_of_deployment(helm, result):
    return _get_containers_of("Deployment", helm, result)


def _get_containers_of(kind, helm, result):
    manifest = helm.get_resource(result, kind=kind)
    init_containers = findall(manifest, "spec.template.spec.initContainers")
    containers = findall(manifest, "spec.template.spec.containers")
    return init_containers + containers
