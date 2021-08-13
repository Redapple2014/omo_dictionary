import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import CustomButton from "../../components/button/CustomButton";
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';

import {
    NAVIGATION_SIGNUP_SCREEN_PATH,
    NAVIGATION_LOGIN_SCREEN_PATH,
  } from '../../navigations/Routes';

const ProfileScreen = (props) => {

    function onCreateAccountButtonPress(){
        props.navigation.navigate(NAVIGATION_SIGNUP_SCREEN_PATH);
      };


      function onHaveAccountButtonPress(){
        props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH);
      };

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                title='Profile'
            />
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.PRIMARY_COLOR, marginBottom: 8, borderRadius: 10 }}
                    title={`${Constants.createAccountTitleText}`}
                    titleStyle={{ fontSize: 14,fontWeight:'bold' }}
                    onPress={onCreateAccountButtonPress}
                />
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`${Constants.haveAccountTitleText}`}
                    titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY,fontWeight:'bold' }}
                    onPress={onHaveAccountButtonPress}
                />
            </View>

        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
}


export default ProfileScreen;
