const light = '#F8F8F8';
const dark = '#333333';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
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
        value: light,
      },
      {
        name: 'dark',
        value: dark,
      },
    ],
  },
}

// look https://github.com/storybookjs/storybook/discussions/17652
import addons from "@storybook/addons";
import { GLOBALS_UPDATED } from "@storybook/core-events";

function changeCSS(theme) {
  const themeCss = document.createElement('link');
  themeCss.id = 'current-theme-css';
  themeCss.rel = 'stylesheet';

  if (theme === light) {
    themeCss.href = `data/light.css`;
  }

  if (theme === dark) {
    themeCss.href = `data/dark.css`;
  }

  document.head.appendChild(themeCss);
}

const channel = addons.getChannel();
channel.on(GLOBALS_UPDATED, ({globals}) => {
  if (globals.backgrounds && globals.backgrounds.value) {
    const links = document.getElementById('current-theme-css');
    if (links) {
      links.remove();
    }

    changeCSS(globals.backgrounds.value);
  }
});

