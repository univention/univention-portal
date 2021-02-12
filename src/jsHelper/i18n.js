import { ref } from 'vue';
import { store } from '@/store/index';

import catalogDE from '@/assets/dictionaries/de_DE.json';
import catalogEN from '@/assets/dictionaries/en_US.json';

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
