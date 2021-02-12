import { ref } from 'vue';
import { store } from '@/store/index';

const catalogDE = {
  Notifications: 'Benachrichtigungen',
  Login: 'Anmelden',
  Logout: 'Abmelden',
  'Edit portal': 'Portal bearbeiten',
};

const catalogEN = {
  Notifications: 'Notifications',
  Login: 'Login',
  Logout: 'Logout',
  'Edit portal': 'Edit portal',
};

const catalogs = {
  de_DE: catalogDE,
  en_US: catalogEN,
};

export default function _(msg) {
  const ret = ref(msg);
  const { state: { locale } } = store;
  const catalog = catalogs[locale.locale];
  if (catalog) {
    ret.value = catalog[msg] || msg;
  }
  return ret;
}
