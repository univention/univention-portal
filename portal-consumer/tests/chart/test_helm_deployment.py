# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


from univention.testing.helm.deployment import Deployment


class TestDeployment(Deployment):
    template_file = "templates/statefulset.yaml"
