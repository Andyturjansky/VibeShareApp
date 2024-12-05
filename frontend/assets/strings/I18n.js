import {I18n as i18n}  from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import es from './translations/es';
import en from './translations/en';
const locales = RNLocalize.getLocales();
//Supported lenaguages
// There is a file naming convetion for the translation fileseach translation files has to be named in a way that represents the language convetion
translations = {es, en};
var I18n = new i18n(translations);
// Default language --> it takes it from the device ́s settings
I18n.locale = locales[0].languageCode;
// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;
export default I18n;