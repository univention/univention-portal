import { translationCatalogs } from '@/i18n/translations';

const getLocalePrefix = function(localeInput: string): string {
  const currentLocale = localeInput;
  return currentLocale.split('_')[0];
};

const translateString = function(translationString: string, shortLocale: string): string {
  let returnString = '';
  if (shortLocale === 'en') {
    returnString = translationString;
    console.log('## IS  EN');
  } else if (shortLocale === 'de') {
    console.log('## IS  TDE');
    returnString = translationCatalogs[shortLocale].translationString ? translationCatalogs[shortLocale].translationString : translationString;
  } else {
    console.warn('HANDLE THIRD LANG');
  }
  console.log('## trsnalation', translationString);
  console.log('## return', returnString);
  return returnString;
};

export { getLocalePrefix, translateString };
