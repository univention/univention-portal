const path = require('path');

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: "@storybook/vue3",
  webpackFinal: async (config, {configType}) => {
    // console.log(JSON.stringify(config.module.rules, null, 4));
    // console.log(path.resolve(__dirname, '../src/assets/styles/_variables.styl'));

    config.module.rules.push({
      test: /\.styl(us)?$/,
      use: ['style-loader', 'css-loader', 'stylus-loader'],
      include: [
        path.resolve(__dirname, '../src'),
        path.resolve(__dirname, '../stories'),
        path.resolve(__dirname, '../src/assets/styles/_variables.styl'),
      ],
    });

    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: ['style-loader', 'css-loader', 'stylus-loader'],
    //   include: [
    //     path.resolve(__dirname, '../src'),
    //     path.resolve(__dirname, '../stories'),
    //   ],
    // });

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
