const path = require('path');


module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "addon-screen-reader"
  ],
  framework: "@storybook/vue3",
  staticDirs: ['../public'],
  webpackFinal: async (config, {configType}) => {
    config.module.rules.push({
      test: /\.styl(us)?$/,
      use: ['style-loader', 'css-loader', 'stylus-loader'],
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../src/assets/styles'),
      ],
    });

    config.resolve.modules = [
      path.resolve(__dirname, "..", "src"),
      "node_modules",
    ]

    config.resolve.alias = {
      '@': path.resolve(__dirname, "../src"),
      'vue': "vue/dist/vue.esm-bundler.js",
    }

    return config;
  },
}
