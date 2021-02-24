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
  COOKIE_SETTINGS: _('Cookie Settings'),
  COOKIE_DESCRIPTION: _('We use cookies in order to provide you with certain functions and to be able to guarantee an unrestricted service. By clicking on "Accept", you consent to the collection of information on this portal.'),
  ACCEPT: _('Accept'),
  SUBMIT: _('Submit'),
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
