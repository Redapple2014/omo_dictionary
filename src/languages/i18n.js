import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import english from './english.json';
import korean from './korean.json';
import chinese from './chinese.json';
import japanese from './japanese.json';
import mongolian from './mongolian.json';
import vietnamese from './vietnamese.json';
import * as RNLocalize from 'react-native-localize';
import PouchDB from 'pouchdb-react-native';
var userDB = new PouchDB('usersettings');

const languageDetector = {
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: callback => {
        userDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                     return console.log(err);
                }
                callback(response?.rows[0]?.doc?.DisplayLanguage?.value || 'en')
            },
        );
    },
    init: () => {},
    cacheUserLanguage: () => {},
  };
  
i18next.use(languageDetector).use(initReactI18next).init({
    fallbackLng:'en',
    resources:{
        en: english,
        ko: korean,
        zh: chinese,
        ja: japanese,
        mn: mongolian,
        vi: vietnamese
    },
    react:{
        useSuspense:false
    }
});

export default i18next;