import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import CustomHeader from "../../components/header";
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/button/CustomButton';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify, { varifyEmail } from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import auth from '@react-native-firebase/auth';
import { Value } from 'react-native-reanimated';


const ForgetPasswordScreen = (props) => {
    const [email, setEmail] = useState('');
    const [isEmailErrorMsg, setIsEmailErrorMsg] = useState(false);

    const forgetPasswordPress = () => {
        
        if(email!=''&& Verify.varifyEmail(email)){
          auth().sendPasswordResetEmail(email).then(()=>{
            props.navigation.dispatch(NavigationActions.back())
          }).catch(e=>alert('Fail to sent mail'))
        }else{
          alert('Enter a valid Email')
        }
        
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='Password'
                    leftIcon='Cancel'
                    onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                />
            </View>
            <CustomInput
        label="Email"
        labelStyle={{
          fontSize: 14,
          marginBottom: 4,
          color: Constants.appColors.DARKGRAY,
          fontWeight: '400',
        }}
        placeholder=" Please enter your email"
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
            <View style={{paddingVertical: 56, alignItems: 'center'}}>
                   <CustomButton
          style={{
            height: 40,
            width: Sizes.WINDOW_WIDTH - 32,
            backgroundColor: Constants.appColors.BUTTON_COLOR,
            marginBottom: 8,
            borderRadius: 10,
          }}
          title='Send Email'
          titleStyle={{fontSize: 14, fontWeight: 'bold'}}
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
