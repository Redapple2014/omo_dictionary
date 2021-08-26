import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import english from './english.json';
import korean from './korean.json';
import * as RNLocalize from 'react-native-localize';

const languageDetector = {
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: callback => callback(RNLocalize.getLocales()[0].languageCode),
    init: () => {},
    cacheUserLanguage: () => {},
  };
  
i18next.use(languageDetector).use(initReactI18next).init({
    fallbackLng:'en',
    resources:{
        en: english,
        ko:korean
    },
    react:{
        useSuspense:false
    }
});

export default i18next;