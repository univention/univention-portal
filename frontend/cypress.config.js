/*
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
*/

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
    fixturesFolder: 'tests/e2e/fixtures',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder: 'tests/e2e/videos',
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      return config;
    },
  },
});
