/**
 * @format
 */
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {AppRegistry} from 'react-native';
import App from './src/app';
import {name as appName} from './app.json';
import i18n from './src/languages/i18n';

AppRegistry.registerComponent(appName, () => App);
