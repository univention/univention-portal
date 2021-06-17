import { translationCatalogs } from '@/i18n/translations';
import getLocalePrefix from './getLocale';

const _ = (translationString: string, ...variables: string[]): string => {
  const shortLocale = getLocalePrefix();
  let returnString = '';
  let cleanedTranslationString = '';
  if (variables) {
    for (let i = 0; i < variables.length; i += 1) {
      console.log(`${translationString}, ${variables[i]}`);
      cleanedTranslationString = translationString.replace(/<.*>/, variables[i]);
      console.log('cleanedTranslationString', cleanedTranslationString);
    }
  }

  if (shortLocale === 'en') {
    returnString = cleanedTranslationString.length > 0 ? cleanedTranslationString : translationString;
  } else if (shortLocale === 'de') {
    returnString = translationCatalogs[shortLocale].translationString ? translationCatalogs[shortLocale].translationString : translationString;
  } else {
    console.warn('Handle third language');
  }

  return returnString;
};

export { _ as default };
