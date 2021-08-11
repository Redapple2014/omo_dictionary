import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';

import { MainAppNavigator } from './navigations/Navigator';
import NavigationService from './navigations/NavigationService';

import SplashScreen from 'react-native-splash-screen'

import { Provider } from 'react-redux';
import { store } from './store/store';

const AppContainer = createAppContainer(MainAppNavigator);

const App = () => {
  useEffect(() => SplashScreen.hide());
  return (
    <NavigationContainer>
      <Provider store={store}>
        <StatusBar barStyle="light-content" hidden={true} backgroundColor='#E1223C' />
        <AppContainer
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </Provider>
    </NavigationContainer>
  )
}


export default App;
