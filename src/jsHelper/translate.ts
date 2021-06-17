import { translationCatalogs } from '@/i18n/translations';
import getLocalePrefix from './getLocale';

const _ = function(translationString: string): string {
  const shortLocale = getLocalePrefix();
  let returnString = '';
  if (shortLocale === 'en') {
    returnString = translationString;
  } else if (shortLocale === 'de') {
    returnString = translationCatalogs[shortLocale].translationString ? translationCatalogs[shortLocale].translationString : translationString;
  } else {
    console.warn('Handle third language');
  }
  return returnString;
};

export { _ as default };
