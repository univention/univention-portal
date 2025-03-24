/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024-2025 Univention GmbH
 */

import process from 'process';

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});
