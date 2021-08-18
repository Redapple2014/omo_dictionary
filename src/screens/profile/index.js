import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet } from 'react-native';
import CustomButton from "../../components/button/CustomButton";
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import { getStatusBarHeight } from "react-native-status-bar-height";

import {
    NAVIGATION_SIGNUP_SCREEN_PATH,
    NAVIGATION_LOGIN_SCREEN_PATH,
} from '../../navigations/Routes';

const ProfileScreen = (props) => {

    function onCreateAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_SIGNUP_SCREEN_PATH);
    };


    function onHaveAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH);
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='Profile'
                />
            </View>

            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.PRIMARY_COLOR, marginBottom: 8, borderRadius: 10 }}
                    title={`${Constants.createAccountTitleText}`}
                    titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                    onPress={onCreateAccountButtonPress}
                />
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`${Constants.haveAccountTitleText}`}
                    titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                    onPress={onHaveAccountButtonPress}
                />
            </View>

        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'red'
    }
});

export default ProfileScreen;
