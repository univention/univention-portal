import { store } from '../store';

const getLocalePrefix = (): string => {
  const currentLocale = store.getters['locale/getLocale'];
  console.log('currentLocale', currentLocale);
  return currentLocale.split('_')[0];
};

export default getLocalePrefix;
