#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#


def test_setup_logger(tmp_path):
    from univention.portal import log

    log_file = tmp_path / "portal.log"
    log.setup_logger(logfile=log_file, log_level="DEBUG")
    unittest_logger = log.get_logger("unittest")
    unittest_logger.info("test_setup_logger works")
