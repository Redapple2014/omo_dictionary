import { Dimensions, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const statusBarHeight = Platform.OS == "ios" ? getStatusBarHeight() : 10;

export default {
  WINDOW_WIDTH: screenWidth,
  WINDOW_HEIGHT: screenHeight,
  statusBarHeight
};