/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'tests/e2e/support/index.js',
    specPattern: 'tests/e2e/specs/*.{js,jsx,ts,tsx}',
  },
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
  },
});
