import { translationCatalogs } from '@/i18n/getTranslations';
import getLocalePrefix from './getLocale';

const _ = (translationString: string, variables?: Record<string, string>): string => {
  const shortLocale = getLocalePrefix();
  let returnString = '';
  let cleanedTranslationString = '';
  if (variables) {
    cleanedTranslationString = translationString.replace(/\[(.*?)\]/g, (...args) => {
      const placeHolder = args[1];
      const parameter = variables;
      let replace = '';
      replace = parameter[placeHolder];
      return replace;
    });
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
