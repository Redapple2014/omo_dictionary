import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar,LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';

import { MainAppNavigator } from './navigations/Navigator';
import NavigationService from './navigations/NavigationService';

import SplashScreen from 'react-native-splash-screen'

import { Provider } from 'react-redux';
import { store } from './store/store';

const AppContainer = createAppContainer(MainAppNavigator);

LogBox.ignoreLogs(['Animated: ...']);


const App = () => {

  const [hideSplash, setHideSplash] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHideSplash(true);
    }, 100); 
  }, []);
  
  React.useEffect(() => {
    hideSplash && SplashScreen.hide();
  }, [hideSplash]);


  return (
    <NavigationContainer>
      <Provider store={store}>
        <StatusBar barStyle="light-content" hidden={false} backgroundColor='#E1223C' />
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
