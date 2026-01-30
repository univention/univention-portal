# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

import pytest

from univention.testing.helm.best_practice.extra_env_vars import ExtraEnvVars


class TestExtraEnvVars(ExtraEnvVars):

    @pytest.mark.skip("portal-frontend has no env variables in the deployment.yaml")
    def test_extra_env_vars_empty_by_default(self, chart, subtests):
        pass
