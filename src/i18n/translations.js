import { ref } from 'vue';
import { store } from '@/store/index';
import catalogDE from '@/assets/dictionaries/de_DE.json';
import catalogEN from '@/assets/dictionaries/en_US.json';

function _(msg) {
  return {
    original: msg,
    translated: ref(msg),
  };
}

const catalog = {
  NOTIFICATIONS: _('Notifications'),
  LOGIN: _('Login'),
  LOGOUT: _('Logout'),
  EDIT_PORTAL: _('Edit portal'),
  SWITCH_LOCALE: _('Switch locale'),
};

function updateLocale(locale) {
  let translationCatalog = null;
  if (locale === 'de_DE') {
    translationCatalog = catalogDE;
  }
  Object.keys(catalog).forEach((key) => {
    const value = catalog[key];
    if (translationCatalog && value.original in translationCatalog) {
      value.translated.value = translationCatalog[value.original];
    } else {
      value.translated.value = value.original;
    }
  });
}

store.watch(
  (state, getters) => getters['locale/getLocale'],
  updateLocale,
);

export default catalog;
