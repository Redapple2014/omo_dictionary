import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform,TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import {
    NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH
} from '../../navigations/Routes';
import { useTranslation } from 'react-i18next';

const FlashcardScreen = (props) => {

    const { t,i18n } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='Flashcard'
                />
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
{/* <TouchableOpacity onPress={()=>props.navigation.navigate(NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH)}> */}
            <Text style={{ fontSize: 30 }}>{`${t("FlashcardPageText")}`}</Text>
            {/* </TouchableOpacity> */}
            </View>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardScreen;
