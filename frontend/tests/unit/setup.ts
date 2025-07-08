/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import process from 'process';
import { config } from '@vue/test-utils';
import VueDOMPurifyHTML from 'vue-dompurify-html';

config.global.plugins.push(VueDOMPurifyHTML);

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});
