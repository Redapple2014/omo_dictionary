import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform,TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import SearchHeader from "../../components/searchHeader";
import {NavigationActions} from 'react-navigation';
import { useTranslation } from 'react-i18next';

const SearchResultScreen = (props) => {

    const { t,i18n } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <SearchHeader
                    title=''
                    leftIcon="Search"
                    onPressleftIcon={() =>
                      props.navigation.dispatch(NavigationActions.back())
                    }
                />
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
{/* <TouchableOpacity onPress={()=>props.navigation.navigate(NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH)}> */}
            <Text style={{ fontSize: 30 }}>Search Result Screen</Text>
            {/* </TouchableOpacity> */}
            </View>
        </View>
    )
}

SearchResultScreen.navigationOptions = {
    headerShown: false
}


export default SearchResultScreen;
