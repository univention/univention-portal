import { translationCatalogs } from '@/i18n/getTranslations';
import getLocalePrefix from './getLocale';


const _ = (translationString: string, variables?: Record<string, string>): string => {
  const shortLocale = getLocalePrefix();
  let returnString = '';
  let cleanedTranslationString = '';
  if (variables) {
    cleanedTranslationString = translationString.replace(/\%\((.*?)\)s/g, (...args) => {
      const placeHolder = args[1];
      const parameter = variables;
      let replace = '';
      replace = parameter[placeHolder];
      return replace;
    });
  }
  console.log('lol', shortLocale);
  if (shortLocale === 'en') {
    returnString = cleanedTranslationString.length > 0 ? cleanedTranslationString : translationString;
  } else if (shortLocale === 'de') {
    console.log('ITS GERMAN', translationString);
    const key = translationCatalogs[shortLocale];
    console.log('ITS GERMAN', key[translationString]);
    returnString = key[translationString] ? key[translationString] : translationString;
  } else {
    console.warn('Handle third language');
  }

  return returnString;
};

export { _ as default };
