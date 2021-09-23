import React, { useState, useEffect,useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import CustomHeader from "../../components/header";
import CustomButton from '../../components/button/CustomButton';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import auth from '@react-native-firebase/auth';
import { useTranslation } from 'react-i18next';

const ForgetPasswordScreen = (props) => {
  const [email, setEmail] = useState('');
  const [isEmailErrorMsg, setIsEmailErrorMsg] = useState(false);

  const emailInputRef = useRef(null)
  const { t,i18n } = useTranslation();
  const forgetPasswordPress = () => {

    if (email != '' && Verify.varifyEmail(email)) {
      auth().sendPasswordResetEmail(email).then(() => {
        props.navigation.dispatch(NavigationActions.back())
      }).catch(e => alert(`${t("FailMailText")}`))
    } else {
      alert(`${t("EmailInvalidText")}`)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
        <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
        <CustomHeader
          title={`${t("PasswordText")}`}
          leftIcon={`${t("CancelText")}`}
          onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
        />
      </View>
      <CustomInput
        label={`${t("EmailText")}`}
        ref={emailInputRef}
        labelStyle={{
          fontSize: 14,
          marginBottom: 4,
          color: Constants.appColors.DARKGRAY,
          fontWeight: '400',
          marginLeft:4
        }}
        placeholder={` ${t("EnterEmailPlaceHolder")}`}
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
        leftIconContainerStyle={{ marginRight: 16 }}
        placeholderTextColor={Constants.appColors.LIGHTGRAY}
        placeholderFontSize={2}
        containerStyle={{ height: 56, padding: 8 }}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setIsEmailErrorMsg(Verify.varifyEmail(value));
        }}
        errorMessage={email && !isEmailErrorMsg ? `${t("EmailInvalidText")}` : ''}
        onSubmitEditing={forgetPasswordPress}
      />
      <View style={{ paddingVertical: 56, alignItems: 'center' }}>
        <CustomButton
          style={{
            height: 40,
            width: Sizes.WINDOW_WIDTH - 32,
            backgroundColor: Constants.appColors.BUTTON_COLOR,
            marginBottom: 8,
            borderRadius: 10,
          }}
          title={`${t("SendEmailText")}`}
          titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
          onPress={forgetPasswordPress}
        />
      </View>
    </View>
  )
}

ForgetPasswordScreen.navigationOptions = {
  headerShown: false
}


export default ForgetPasswordScreen;
