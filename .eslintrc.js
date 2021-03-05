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
    ecmaFeatures: {
      legacyDecorators: true,
    },
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
  ],
  rules: {
    'arrow-parens': ['error', 'always'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    // 'import/extensions': ['error', 'always', { ignorePackages: true }],
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
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-useless-escape': 'off',
    'operator-linebreak': [
      'error',
      'after',
      { overrides: { '?': 'before', ':': 'before' } },
    ],
    'prefer-destructuring': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'space-in-parens': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'space-before-function-paren': process.env.NODE_ENV === 'production' ? 'error' : 'warn',

    // ToDo: Temporay rule settings that should be deleted when code issues are fixed!

    'import/no-extraneous-dependencies': 'warn', // eg no use of 'require' -> Convert all .js to .ts files and use import!
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      },
    },
    'jest': {
      version: 26,
    },
  },
};
