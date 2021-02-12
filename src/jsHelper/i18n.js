import { ref } from 'vue';
import { store } from '@/store/index';

const catalogDE = {
  Login: 'Anmelden',
  Logout: 'Abmelden',
  'Edit portal': 'Portal bearbeiten',
};

const catalogEN = {
};

const catalogs = {
  de_DE: catalogDE,
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
