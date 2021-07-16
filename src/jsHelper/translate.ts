import { translationCatalogs, updateLocale } from '@/i18n/translations';
import getLocalePrefix from './getLocale';

const replaceKeys = (translationString: string, variables: Record<string, string>): string => {
  const newString = translationString.replace(/\%\((.*?)\)s/g, (...args) => {
    const placeHolder = args[1];
    const parameter = variables;
    let replace = '';
    replace = parameter[placeHolder];
    return replace;
  });
  return newString;
};

const _ = (translationString: string, variables?: Record<string, string>): string => {
  const shortLocale = getLocalePrefix();
  let returnString = '';
  if (shortLocale === 'en') {
    returnString = variables ? replaceKeys(translationString, variables) : translationString;
  } else if (shortLocale === 'de') {
    if (Object.keys(translationCatalogs).length === 0) {
      updateLocale('de_DE');
    }
    const key = translationCatalogs.de;
    const germanTranslation = key ? key[translationString] : translationString;
    returnString = variables ? replaceKeys(translationString, variables) : germanTranslation;
  } else {
    console.warn('Handle third language');
  }

  return returnString;
};

export { _ as default };
