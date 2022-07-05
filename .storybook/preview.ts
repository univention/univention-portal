import { app } from '@storybook/vue3';
import { store } from '../src/store';

app.use(store);

const lightColor = '#F8F8F8';
const darkColor = '#333333';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: lightColor,
      },
      {
        name: 'dark',
        value: darkColor,
      },
    ],
  },
};

// look https://github.com/storybookjs/storybook/discussions/17652
import addons from '@storybook/addons';
import { GLOBALS_UPDATED } from '@storybook/core-events';

function changeCSS(themeColor) {
  const themeCss = document.createElement('link');
  themeCss.id = 'current-theme-css';
  themeCss.rel = 'stylesheet';

  if (themeColor === lightColor) {
    themeCss.href = `data/light.css`;
  }

  if (themeColor === darkColor) {
    themeCss.href = `data/dark.css`;
  }

  document.head.appendChild(themeCss);
}

const channel = addons.getChannel();
channel.on(GLOBALS_UPDATED, ({ globals }) => {
  if (globals.backgrounds && globals.backgrounds.value) {
    const links = document.getElementById('current-theme-css');
    if (links) {
      links.remove();
    }

    changeCSS(globals.backgrounds.value);
  }
});

// set global css
import '!style-loader!css-loader!stylus-loader!../src/assets/styles/style.styl';
// set default theme
changeCSS(lightColor);


import { useArgs } from '@storybook/client-api'

export const decorators = [
  (story, context) => {
    const [_, updateArgs] = useArgs()
    return story({...context, updateArgs})
  },
  () => ({template: '<story />'}),
];
