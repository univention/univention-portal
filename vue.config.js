// eslint-disable-next-line
const path = require("path");

const vueConfig = {
  filenameHashing: false,
  pwa: {
    name: 'UPX Portal',
  },
};

// We may already have an existing `configureWebpack` definition (e.g. when building the server bundle).
// So we need to preserve that definition and ensure it is invoked along with the config
// options that are common to both client/server bundles.
const existingConfigureWebpack = vueConfig.configureWebpack;

vueConfig.configureWebpack = (config) => {
  if (existingConfigureWebpack) {
    existingConfigureWebpack(config);
  }

  // we turn off `.mjs` file support in Vue, because `graphql` ships
  // mjs files in its npm package (bad) and Vue's webpack settings destroy
  // graphql's mjs files, causing strange runtime errors. By disabling mjs,
  // we make webpack use the .js files in graphql instead, which work fine.
  const indexOfMjs = config.resolve.extensions.indexOf('.mjs');
  if (indexOfMjs > -1) {
    config.resolve.extensions.splice(indexOfMjs, 1);
  }
  config.module.rules.push({
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  });

  config.module.rules.push({
    test: /\.ya?ml$/,
    loader: 'json-loader!yaml-loader',
  });
};

// Below is a workaround when building the app within the context of the JSS monorepo.
// The monorepo uses symlinks within the `node_modules` folder to reference `sitecore-jss-*` packages,
// which causes the eslint loader to attempt resolving eslint config from the _actual_ package location,
// not the "virtual" location under `node_modules`. In turn, an incorrect eslint config is resolved and
// breaks the build process.
// The workaround is to exclude the `packages/sitecore-jss*` packages from eslint-loader.

// We may already have an existing `chainWebpack` definition (e.g. when building the server bundle).
// So we need to preserve that definition and ensure it is invoked along with the config
// options that are common to both client/server bundles.
const existingChainWebpack = vueConfig.chainWebpack;
vueConfig.chainWebpack = (config) => {
  if (existingChainWebpack) {
    existingChainWebpack(config);
  }

  // Also look at
  //   jest.config.js
  //   tsconfig.json
  config.resolve.alias
    // components
    .set('components', path.resolve(__dirname, 'src/components'))
    .set('globals', path.resolve(__dirname, 'src/components/globals'))

    // other stuff
    .set('assets', path.resolve(__dirname, 'src/assets'))
    .set('mixins', path.resolve(__dirname, 'src/mixins'))
    .set('views', path.resolve(__dirname, 'src/views'));

  // TODO: In case that the paths will not be resolved in production we might have to install "module-alias": https://medium.com/@caludio/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa
};

module.exports = vueConfig;
