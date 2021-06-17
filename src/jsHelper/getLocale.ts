import { store } from '../store';

const getLocalePrefix = function(): string {
  const currentLocale = store.getters['locale/getLocale'];
  return currentLocale.split('_')[0];
};

export default getLocalePrefix;
