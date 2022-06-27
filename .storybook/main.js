const path = require('path');

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  "framework": "@storybook/vue3",
  features: {
    previewCsfV3: true,
  },
  webpackFinal: async (config, { configType }) => {
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'sass-loader'],
    //   include: path.resolve(__dirname, '../'),
    // });

    config.resolve.alias = {
      '@': path.resolve(__dirname, "../src"),
      'vue': "vue/dist/vue.esm-bundler.js",
    }

    return config;
  },
}
