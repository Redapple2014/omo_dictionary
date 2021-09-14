import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Constants, { forgetPasswordText } from '../utills/Constants';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import AntIcons from 'react-native-vector-icons/AntDesign';

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

import {
  BOTTOM_TAB_NAVIGATOR,

  NAVIGATION_HOME_STACK_PATH,
  NAVIGATION_HOME_SCREEN_PATH,
  NAVIGATION_SEARCH_RESULT_SCREEN_PATH,

  NAVIGATION_FLASHCARD_LIST_STACK_PATH,
  NAVIGATION_FLASHCARD_LIST_SCREEN_PATH,
  NAVIGATION_NEW_CARD_SCREEN_PATH,
  NAVIGATION_DISPLAY_CARD_SCREEN_PATH,

  NAVIGATION_PROFILE_STACK_PATH,
  NAVIGATION_PROFILE_SCREEN_PATH,

  NAVIGATION_FLASHCARD_STACK_PATH,
  NAVIGATION_FLASHCARD_SCREEN_PATH,

  NAVIGATION_SIGNUP_SCREEN_PATH,
  NAVIGATION_LOGIN_SCREEN_PATH,
  NAVIGATION_FORGET_PASSWORD_SCREEN_PATH,


  NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH

} from './Routes';


const shouldTabBarVisible = (navigation) => {
  console.log(navigation.route.state.index)
  try {
    return navigation.route.state.index < 1;
  } catch (e) {
    return true;
  }
};

const HomeStack = createStackNavigator(
  {
    [NAVIGATION_HOME_SCREEN_PATH]: HomeScreen,
    [NAVIGATION_SEARCH_RESULT_SCREEN_PATH]:SearchResultScreen
  },
  {
    initialRouteName: NAVIGATION_HOME_SCREEN_PATH,
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

const FlashcardsStack = createStackNavigator(
  {
    [NAVIGATION_FLASHCARD_SCREEN_PATH]: FlashcardScreen,
    [NAVIGATION_NEW_CARD_SCREEN_PATH]: NewCardScreen,
    [NAVIGATION_DISPLAY_CARD_SCREEN_PATH]: DisplayCardScreen,
    [NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH]:ChangePasswordScreen,
    
  },
  {
    initialRouteName: NAVIGATION_FLASHCARD_SCREEN_PATH,
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

const FlashcardlistStack = createStackNavigator(
  {
    [NAVIGATION_FLASHCARD_LIST_SCREEN_PATH]: FlashcardListScreen,
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
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <FeatherIcons name="bookmark" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: true
      })
    },
    [NAVIGATION_FLASHCARD_LIST_STACK_PATH]: {
      screen: FlashcardlistStack,
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor }) => {
          return <AntIcons name="edit" size={24} color={focused ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.DARKGRAY} />;
        },
        tabBarVisible: true
      })
    },
    [NAVIGATION_PROFILE_STACK_PATH]: {
      screen: ProfileStack,
      navigationOptions:({navigation,route}) => 
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

