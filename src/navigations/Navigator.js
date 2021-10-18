import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Constants, { forgetPasswordText } from '../utills/Constants';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AntIcons from 'react-native-vector-icons/AntDesign';
// import TransitionConfiguration from './TransitionConfiguration';

import HomeScreen from '../screens/home';
import FlashcardScreen from '../screens/flashcard';
import FlashcardListScreen from '../screens/flashcardlist';
import ProfileScreen from '../screens/profile';
import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';
import ForgetPasswordScreen from '../screens/forgetpassword';
import ChangePasswordScreen from '../screens/changepassword';
import SearchResultScreen from '../screens/searchresult';
import NewCardScreen from '../screens/newcard';
import DisplayCardScreen from '../screens/displaycard';
import ViewFlashcardDataScreen from '../screens/viewflashcard';
import ChooseLanguageScreen from '../screens/settings/chosselanguage';
import DictionaryScreen from '../screens/settings/dictionary';
import FlashcardListsScreen from '../screens/settings/flashcards';
import FlashcardListRenderScreen from '../screens/settings/flashcardlist';
import EditProfileScreen from '../screens/editprofile';
import AboutScreen from '../screens/about';
import TestCategoryScreen from '../screens/testcategories';
import FrontDisplayScreen from '../screens/frontdisplay';
import StartTestScreen from '../screens/starttest';
import TestResultScreen from '../screens/testresult';
import BuyProScreen from '../screens/buypro';

import {
  BOTTOM_TAB_NAVIGATOR,

  NAVIGATION_HOME_STACK_PATH,
  NAVIGATION_HOME_SCREEN_PATH,
  NAVIGATION_SEARCH_RESULT_SCREEN_PATH,

  NAVIGATION_FLASHCARD_LIST_STACK_PATH,
  NAVIGATION_FLASHCARD_LIST_SCREEN_PATH,
  NAVIGATION_NEW_CARD_SCREEN_PATH,
  NAVIGATION_DISPLAY_CARD_SCREEN_PATH,
  NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH,

  NAVIGATION_PROFILE_STACK_PATH,
  NAVIGATION_PROFILE_SCREEN_PATH,
  NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH,
  NAVIGATION_DICTIONARY_SETTINGS_SCREEN_PATH,
  NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH,
  NAVIGATION_FLASHCARD_RENDER_LISTS_SCREEN_PATH,
  NAVIGATION_EDIT_PROFILE_SCREEN_PATH,
  NAVIGATION_ABOUT_SCREEN_PATH,
  NAVIGATION_BUY_PRO_SCREEN_PATH,

  NAVIGATION_FLASHCARD_STACK_PATH,
  NAVIGATION_FLASHCARD_SCREEN_PATH,
  NAVIGATION_TEST_CATEGORY_SCREEN_PATH,
  NAVIGATION_FRONT_DISPLAY_SCREEN_PATH,
  NAVIGATION_START_TEST_SCREEN_PATH,
  NAVIGATION_TEST_RESULT_SCREEN_PATH,

  NAVIGATION_SIGNUP_SCREEN_PATH,
  NAVIGATION_LOGIN_SCREEN_PATH,
  NAVIGATION_FORGET_PASSWORD_SCREEN_PATH,


  NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH

} from './Routes';

const HomeStack = createStackNavigator(
  {
    [NAVIGATION_HOME_SCREEN_PATH]: HomeScreen,
    [NAVIGATION_SEARCH_RESULT_SCREEN_PATH]: SearchResultScreen
  },
  {
    initialRouteName: NAVIGATION_HOME_SCREEN_PATH,
    navigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
        alignSelf: 'center'
      }
    },
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
  }
);

const FlashcardsStack = createStackNavigator(
  {
    [NAVIGATION_FLASHCARD_SCREEN_PATH]: FlashcardScreen,
    [NAVIGATION_NEW_CARD_SCREEN_PATH]: NewCardScreen,
    [NAVIGATION_DISPLAY_CARD_SCREEN_PATH]: DisplayCardScreen,
    [NAVIGATION_FLASH_CARD_DATA_SCREEN_PATH]: ViewFlashcardDataScreen,
    [NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH]: ChangePasswordScreen,

  },
  {
    initialRouteName: NAVIGATION_FLASHCARD_SCREEN_PATH,
    navigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
        alignSelf: 'center'
      }
    },
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
  }
);

const FlashcardlistStack = createStackNavigator(
  {
    [NAVIGATION_FLASHCARD_LIST_SCREEN_PATH]: FlashcardListScreen,
    [NAVIGATION_TEST_CATEGORY_SCREEN_PATH]: TestCategoryScreen,
    [NAVIGATION_FRONT_DISPLAY_SCREEN_PATH]: FrontDisplayScreen,
    [NAVIGATION_START_TEST_SCREEN_PATH]: StartTestScreen,
    [NAVIGATION_TEST_RESULT_SCREEN_PATH]: TestResultScreen
  },
  {
    initialRouteName: NAVIGATION_FLASHCARD_LIST_SCREEN_PATH,
    navigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
        alignSelf: 'center'
      }
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
  }
);

const ProfileStack = createStackNavigator(
  {
    [NAVIGATION_PROFILE_SCREEN_PATH]: ProfileScreen,
    [NAVIGATION_LOGIN_SCREEN_PATH]: LoginScreen,
    [NAVIGATION_SIGNUP_SCREEN_PATH]: SignupScreen,
    [NAVIGATION_FORGET_PASSWORD_SCREEN_PATH]: ForgetPasswordScreen,
    [NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH]: ChooseLanguageScreen,
    [NAVIGATION_DICTIONARY_SETTINGS_SCREEN_PATH]: DictionaryScreen,
    [NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH]: FlashcardListsScreen,
    [NAVIGATION_FLASHCARD_RENDER_LISTS_SCREEN_PATH]: FlashcardListRenderScreen,
    [NAVIGATION_EDIT_PROFILE_SCREEN_PATH]: EditProfileScreen,
    [NAVIGATION_ABOUT_SCREEN_PATH]: AboutScreen,
    [NAVIGATION_BUY_PRO_SCREEN_PATH]: BuyProScreen
  },
  {
    initialRouteName: NAVIGATION_PROFILE_SCREEN_PATH,
    navigationOptions: {
      headerTitleStyle: {
        fontSize: 18,
        alignSelf: 'center'
      }
    }
  },
  {
    defaultNavigationOptions: {
      header: null
    },
  }
);

export const MainAppNavigator = createBottomTabNavigator(
  {
    [NAVIGATION_HOME_STACK_PATH]: {
      screen: HomeStack,
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <AntIcons name="search1" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: true
      })
    },
    [NAVIGATION_FLASHCARD_STACK_PATH]: {
      screen: FlashcardsStack,
      navigationOptions: ({ navigation, route }) => {
        // console.log(navigation?.state?.routes[1]?.routeName , navigation?.state?.routes[2]?.routeName )
        return ({
        tabBarIcon: ({ focused, tintColor }) => {
          // console.log(navigation.state)
          return <FeatherIcons name="bookmark" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: (navigation?.state?.routes[1]?.routeName == 'NewCardScreen' || navigation?.state?.routes[2]?.routeName == 'NewCardScreen') ? false : true
      })}
    },
    [NAVIGATION_FLASHCARD_LIST_STACK_PATH]: {
      screen: FlashcardlistStack,
      navigationOptions: ({ navigation, route }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <AntIcons name="edit" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: (navigation.state.index == 1 || navigation.state.index == 2) ? false : true
      })
    },
    [NAVIGATION_PROFILE_STACK_PATH]: {
      screen: ProfileStack,
      navigationOptions: ({ navigation, route }) =>
      ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <MIcon name="account-outline" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: navigation.state.index == 1 ? false : true
      })
    }
  },

  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Constants.appColors.BLUE,
      inactiveTintColor: Constants.appColors.GRAY,
      tabBarVisible: true
    }
  },

);

