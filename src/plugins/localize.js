// plugins/localize.js
import { store } from '@/store';

const localize = {
  install: (app, options) => {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$localized = (label) => {
      const curLocale = store.state.locale.locale;

      let i18nLabel = label.de_DE;
      if (curLocale === 'en_US') {
        i18nLabel = label.en_US;
      }
      return i18nLabel;
    };
  },
};

// Usage example:
// {{ $localized(label) }}
export default localize;
