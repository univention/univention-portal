// plugins/localize.js
import { store } from '@/store';

// expects an object, returns a string
const localize = {
  install: (app, options) => {
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$localized = (label) => {
      const curLocale = store.state.locale.locale;
      let translate = label[curLocale] || label.en;

      if (label.en === undefined) {
        translate = label[curLocale] || label.en_US;
      }

      return translate;
    };
  },
};

// Usage example:
// {{ $localized(label) }}
export default localize;
