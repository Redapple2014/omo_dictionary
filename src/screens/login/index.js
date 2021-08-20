import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, TouchableOpacity, Platform} from 'react-native';
import CustomHeader from '../../components/header';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/button/CustomButton';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from '../../components/input/CustomInput';
import {NavigationActions} from 'react-navigation';
import {NAVIGATION_FORGET_PASSWORD_SCREEN_PATH} from '../../navigations/Routes';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NAVIGATION_PROFILE_SCREEN_PATH
} from '../../navigations/Routes';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecurePassword, setIsSecurePassword] = useState(true);
  const [isEmailErrorMsg, setIsEmailErrorMsg] = useState(false);
  const [isPasswordErrorMsg, setIsPasswordErrorMsg] = useState(false);

  
  function onForgetPasswordPress() {
    props.navigation.navigate(NAVIGATION_FORGET_PASSWORD_SCREEN_PATH);
  }

  const userLogin = () => {
    if (email.length == 0 || password.length == 0) {
      alert('Enter details to signin')
  } 
  else if (!Verify.varifyPassword(password) || !Verify.varifyEmail(email)) {
      alert('Enter a valid email/password')
  }
  else {
      auth()
      .signInWithEmailAndPassword(email,password)
      .then((res) => {
        AsyncStorage.setItem('user_data', JSON.stringify(res.user))
        props.navigation.navigate(NAVIGATION_PROFILE_SCREEN_PATH,{userdata: res.user })
      })
      .catch(error => alert('Fail to login. Check your id & password'))
    }
  }

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: Constants.appColors.PRIMARY_COLOR,
          paddingTop: Platform.OS == 'ios' ? getStatusBarHeight() : 0,
        }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Constants.appColors.PRIMARY_COLOR}
        />
        <CustomHeader
          title="Login"
          leftIcon="Cancel"
          onPressleftIcon={() =>
            props.navigation.dispatch(NavigationActions.back())
          }
        />
      </View>
      <CustomInput
        label="Username"
        labelStyle={{
          fontSize: 14,
          marginBottom: 4,
          color: Constants.appColors.DARKGRAY,
          fontWeight: '400',
        }}
        placeholder=" Please enter username or email"
        autoCapitalize="none"
        returnKeyType="next"
        autoCorrect={false}
        inputContainerStyle={{
          margin: 4,
          fontSize: 12,
          backgroundColor: 'white',
          borderRadius: 6,
          borderWidth: 0,
        }}
        keyboardType="email-address"
        leftIconContainerStyle={{marginRight: 16}}
        placeholderTextColor={Constants.appColors.LIGHTGRAY}
        placeholderFontSize={2}
        containerStyle={{height: 50, padding: 8}}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setIsEmailErrorMsg(Verify.varifyEmail(value));
        }}
        errorMessage={email && !isEmailErrorMsg ? 'Email Id is invalid' : ''}
      />
      <CustomInput
        label="Password"
        labelStyle={{
          fontSize: 14,
          marginBottom: 4,
          color: Constants.appColors.DARKGRAY,
          fontWeight: '400',
        }}
        autoCapitalize="none"
        returnKeyType="next"
        autoCorrect={false}
        inputContainerStyle={{
          margin: 4,
          fontSize: 12,
          backgroundColor: 'white',
          borderRadius: 6,
          borderWidth: 0,
          color: 'red',
        }}
        keyboardType="default"
        RightIconContainerStyle={{marginLeft: 16}}
        placeholderTextColor={Constants.appColors.LIGHTGRAY}
        placeholderFontSize={10}
        placeholder="Enter Password"
        secureTextEntry={isSecurePassword ? isSecurePassword : false}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setIsPasswordErrorMsg(Verify.varifyPassword(value));
        }}
        errorStyle={{color: Constants.appColors.PRIMARY_COLOR}}
        containerStyle={{height: 50, marginVertical: 48}}
        errorMessage={
          password && !isPasswordErrorMsg ? 'Password is invalid' : ''
        }
        onSubmitEditing={() => console.log('submit log in')}
        rightIcon={
          <TouchableOpacity
            onPress={() => setIsSecurePassword(!isSecurePassword)}>
            <Icon
              name={
                password && isSecurePassword ? 'eye-sharp' : 'eye-off-sharp'
              }
              size={24}
              color={Constants.appColors.TEXT_INPUT}
            />
          </TouchableOpacity>
        }
      />
      <View style={{paddingVertical: 16, alignItems: 'center'}}>
        <CustomButton
          style={{
            height: 40,
            width: Sizes.WINDOW_WIDTH - 32,
            backgroundColor: Constants.appColors.BUTTON_COLOR,
            marginBottom: 8,
            borderRadius: 10,
          }}
          title={`${Constants.loginButtonText}`}
          titleStyle={{fontSize: 14, fontWeight: 'bold'}}
          onPress={userLogin}
        />
        <CustomButton
          style={{
            height: 40,
            width: Sizes.WINDOW_WIDTH - 32,
            backgroundColor: Constants.appColors.TRANSPARENT,
            borderWidth: 0,
            borderColor: Constants.appColors.DARKGRAY,
            borderRadius: 10,
          }}
          title={`${Constants.forgetPasswordText}`}
          titleStyle={{
            fontSize: 14,
            color: Constants.appColors.DARKGRAY,
            fontWeight: 'bold',
          }}
          onPress={onForgetPasswordPress}
        />
      </View>
    </View>
  );
};

LoginScreen.navigationOptions = {
  headerShown: false,
};

export default LoginScreen;
