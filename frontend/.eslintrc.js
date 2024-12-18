/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
    ecmaVersion: 2020,
    ecmaFeatures: { legacyDecorators: true },
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'jest',
    'json',
    'vue',
  ],
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:jest/recommended',
    'plugin:eslint-comments/recommended',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:storybook/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { caughtErrors: 'none' }],
    '@typescript-eslint/ban-ts-comment': 'off', // removed rule, since vue mixins and typescript are causing errors
    'arrow-parens': ['error', 'always'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    // 'import/extensions': ['error', 'always', { ignorePackages: true }],
    'function-paren-newline': 'off',
    'max-len': [
      'error',
      {
        code: 180,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreUrls: true,
      },
    ],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-use-before-define': ['error', {
      functions: false,
    }],
    'no-useless-escape': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'before', ':': 'before' } },
    ],
    'prefer-destructuring': 'off',
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'space-in-parens': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'space-before-function-paren': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // Disabled rules from ESLint core that don't work together with TypeScript code
    'no-unused-vars': 'off',
    'no-unused-expressions': 'off',
    // TODO: Temporay rule settings that should be deleted when code issues are fixed
    'import/no-extraneous-dependencies': 'warn', // e.g. no use of 'require' -> Convert all .js to .ts files and use import!
    'vue/no-unused-components': 'off',
    'vue/multi-word-component-names': 'off',

    // TODO: The "vuejs-accessibility" warnings do require fixing in the future.
    // They should be put back to the level "error" once these have been fixed.
    'vuejs-accessibility/aria-props': 'warn',
    'vuejs-accessibility/form-control-has-label': 'warn',
    'vuejs-accessibility/click-events-have-key-events': 'warn',
    'vuejs-accessibility/interactive-supports-focus': 'warn',
    'vuejs-accessibility/label-has-for': 'warn',
    'vuejs-accessibility/mouse-events-have-key-events': 'warn',

    // TEST new Plugin
    'import/no-cycle': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: { jest: true },
      rules: {
        // When using "describe" to group tests, then a blank line as a first
        // element inside of the block is desired, so that test cases are
        // visually separated still.
        'padded-blocks': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': { node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'] } },
    jest: { version: 27 },
  },
};
