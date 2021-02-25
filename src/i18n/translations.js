import { ref } from 'vue';
import axios from 'axios';

// get env vars
const portalUrl = process.env.VUE_APP_PORTAL_URL || '';

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
  DISMISS_NOTIFICATION: _('Dismiss notification'),
  LOGIN_REMINDER_DESCRIPTION: _('Login <a class="notification-bubble__link" href="#">here</a> so that you can use the full range of functions of UCS.'),
};

const translationCatalogs = {};

function getCatalog(locale) {
  return new Promise((resolve, reject) => {
    if (locale in translationCatalogs) {
      const translationCatalog = translationCatalogs[locale];
      if (translationCatalog) {
        resolve(translationCatalog);
      } else {
        reject();
      }
    } else {
      axios.get(`${portalUrl}/i18n/${locale}.json`).then(
        (response) => {
          const translationCatalog = response.data;
          translationCatalogs[locale] = translationCatalog;
          resolve(translationCatalog);
        }, (error) => {
          // no locale found (404?)
          translationCatalogs[locale] = null;
          reject();
        },
      );
    }
  });
}

async function updateLocale(locale) {
  const localePart = locale.slice(0, 2);
  return getCatalog(localePart).then(
    (translationCatalog) => {
      Object.keys(catalog).forEach((key) => {
        const value = catalog[key];
        if (translationCatalog && value.original in translationCatalog) {
          value.translated.value = translationCatalog[value.original];
        } else {
          value.translated.value = value.original;
        }
      });
    }, () => {
      // no locale found (404?)
      Object.keys(catalog).forEach((key) => {
        const value = catalog[key];
        value.translated.value = value.original;
      });
    },
  );
}

export { catalog, updateLocale };
