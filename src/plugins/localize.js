// plugins/localize.js
import { store } from '@/store';

// expects an object, returns a string
const localize = {
  install: (app) => {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$localized = (label) => {
      const curLocale = store.state.locale.locale;
      const shortLocale = curLocale.split('_')[0];
      return label[curLocale] || label[shortLocale] || label.en || label.en_US;
    };
  },
};

// Usage example:
// {{ $localized(label) }}
export default localize;
