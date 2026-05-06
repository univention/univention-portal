/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import process from 'process';
import { config } from '@vue/test-utils';
import VueDOMPurifyHTML from 'vue-dompurify-html';

// jest-environment-jsdom (jsdom v16) doesn't expose these globals; needed by uuid v14 (crypto.randomUUID)
// and packages that depend on TextEncoder/TextDecoder.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { TextEncoder: TextEncoderImpl, TextDecoder: TextDecoderImpl } = require('util');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { webcrypto } = require('crypto');

Object.assign(globalThis, {
  TextEncoder: TextEncoderImpl,
  TextDecoder: TextDecoderImpl,
  crypto: webcrypto,
});

config.global.plugins.push(VueDOMPurifyHTML);

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection', reason);
});
