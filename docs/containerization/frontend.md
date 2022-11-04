# Frontend

```shell
/usr/share/univention-web/themes/[dark/light/<you-name-it>].css => ucr: ucs/web/theme
/usr/share/univention-portal/custom.css

```

## Build

```shell title='.env.production'
VUE_APP_THEME_PATH=/univention/theme.css
VUE_APP_LANGUAGE_DATA=/univention/languages.json
VUE_APP_META_DATA=/univention/meta.json
VUE_APP_PORTAL_DATA=./portal.json
```

```js title='src/store/index.ts'
// get env vars
const portalUrl = process.env.VUE_APP_PORTAL_URL || '';
const languageJsonPath = process.env.VUE_APP_LANGUAGE_DATA || '/univention/languages.json';
const portalJsonPath = process.env.VUE_APP_PORTAL_DATA || './portal.json';
const portalMetaPath = process.env.VUE_APP_META_DATA || '/univention/meta.json';
```

??? abstract "vue.config.js"
    
    ```javascript
    const path = require('path');
    const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
    const production = process.env.NODE_ENV === 'production';

    const vueConfig = {
      filenameHashing: false,
      pwa: {
        name: 'Univention Portal',
      },
      // configureWebpack: {
      //   optimization: {
      //     minimizer: production ? [
      //       new UglifyJsPlugin({
      //         uglifyOptions: {
      //           compress: {
      //             drop_console: true
      //           },
      //         }
      //       })
      //     ] : []
      //   }
      // },
      chainWebpack: (config) => {
        config
          .plugin('html')
          .tap((args) => {
            args[0].title = 'Univention Portal';
            args[0].theme = process.env.VUE_APP_THEME_PATH;
            return args;
          });
        config
          .optimization.minimizer('uglifyjs')
          .use(UglifyJsPlugin, [{
            uglifyOptions: {
              compress: {
                drop_console: production,
              },
            }
          }]);
      },
      css: {
        sourceMap: true,
        loaderOptions: {
          stylus: {
            import: [
              path.resolve(__dirname, 'src/assets/styles/_variables.styl'),
            ],
          },
        },
      },
      publicPath: './',
    };

    const existingConfigureWebpack = vueConfig.configureWebpack;

    vueConfig.configureWebpack = (config) => {
      if (existingConfigureWebpack) {
        existingConfigureWebpack(config);
      }

      config.module.rules.push({
        test: /\.ya?ml$/,
        use: ['json-loader', 'yaml-loader'],
      });
    };

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

      // TODO: In case that the paths will not be resolved in production we might have to install 'module-alias': https://medium.com/@caludio/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa
    };

    module.exports = vueConfig;
    ```

## Routes

- passwordchange
- profile
- createaccount
- verifyaccount (username, token)
- protectaccount
- passwordforgotten
- newpassword (username, token)
- servicespecificpasswords

## Shell scripts

process-vue-files.sh
: extract JS (`<script>` content) from *.vue files

sync
: shell script, rsyncs to target argument
