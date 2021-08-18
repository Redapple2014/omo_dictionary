import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
const FlashcardScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='Flashcard'
                />
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text style={{ fontSize: 30 }}>Flashcard page</Text>
            </View>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardScreen;
