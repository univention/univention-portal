module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'airbnb',
    '@vue/eslint-config-airbnb',
  ],
  plugins: [
    'vue',
    'json',
    'jest',
  ],
  rules: {
    'max-len': 'off',
    // 'no-console': ['error', { allow: ['error'] }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-useless-escape': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'comma-spacing': ['error', {
      before: false,
      after: true,
    }],
    'space-in-parens': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'space-before-function-paren': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'arrow-parens': ['error', 'always'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    'prefer-destructuring': 'off',
    // TODO: Should be activated again once a solution is found
    'no-unused-vars': 'off',
    'import/extensions': 'off',
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 'import/extensions': ['error', 'never'],
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //     vue: 'never',
    //   },
    // ],
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
    react: {
      version: '999.999.999',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'],
      },
    },
  },
};
