module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 2020,
    // 'ecmaFeatures': {
    //   'legacyDecorators': true,
    // },
  },
  extends: [
    // "eslint:recommended",
    // "plugin:vue/vue3-essential",
    // "@vue/typescript/recommended",
    // "@vue/prettier",
    // "@vue/prettier/@typescript-eslint",
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
    // "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    'no-console': ['error', { allow: ['error'] }],
    'import/extensions': ['error', 'never'],
    'max-len': 'off',
    'no-useless-escape': 'off',
    quotes: [2, 'single', { avoidEscape: true }],
    'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before' } }],
    'comma-spacing': ['error', {
      before: false,
      after: true,
    }],
    'space-before-function-paren': ['error', 'never'],
    'arrow-parens': ['error', 'always'],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
  },
  // overrides: [
  //   {
  //     files: [
  //       '**/__tests__/*.{j,t}s?(x)',
  //       '**/tests/unit/**/*.spec.{j,t}s?(x)'
  //     ],
  //     env: {
  //       jest: true
  //     }
  //   }
  // ]
};
