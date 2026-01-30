# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025-2026 Univention GmbH

from univention.testing.helm.best_practice.image_configuration import ImageConfiguration
from univention.testing.helm.utils import apply_mapping


class TestImageConfiguration(ImageConfiguration):

    def adjust_values(self, values: dict):
        mapping = {
            "assetLoader.image": "image",
        }
        apply_mapping(values, mapping, copy=True)

        return values
