import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet,StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-simple-toast';
const pkg = require('../../../package.json');


const AboutScreen = (props) => {

    const { t, i18n } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
            <View style={styles.container}>
                <View style={{ width: 100, left: -4, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>{`${t("ProfileText")}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textStyle}>{`${t("AboutText")}`}</Text>
            </View>
            </View>
            <View style={{ alignItems:'center',paddingVertical:12,backgroundColor:"white" }}>
                <Image style={{ width: 200, height: 100, resizeMode: 'contain' }} source={require('../../assets/logo/full_logo_red.png')} />
                <Text style={[styles.textStyle,{color:Constants.appColors.GRAY,fontSize:14}]}>{`${t("VersionText")} ${pkg.version}`}</Text>
                <Text style={[styles.textStyle,{color:Constants.appColors.GRAY,fontSize:13}]}>{`Copyright © 2021 Robin Z. Xu`}</Text>
            </View>
            <Text style={{marginLeft:12,marginVertical:4,fontWeight:"900"}}>{`Credits`}</Text>
            <View style={{paddingVertical:8,backgroundColor:"white" }}>
                <Text style={[{color:Constants.appColors.GRAY,fontSize:13,marginLeft:12}]}>{`Korean-English Learners' Dictionary Copyright © National Institure of Korean Language, distributed under the CC BY-SA license `}</Text>
                <Text style={[{color:Constants.appColors.GRAY,fontSize:13,marginLeft:12,marginTop:8}]}>{`React Native TTS Copyright © 2016 Anton Krasovsky distrited under the MIT license`}</Text>
            </View>
        </View>
    )

}


AboutScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row',
    },
    textStyle: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        marginLeft: 8,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    MenuItems: {
        height: 40,
        borderBottomWidth: .5,
        borderBottomColor: Constants.appColors.LIGHTGRAY,
        justifyContent: 'center'
    },
    MenuItemIconStyle: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK,
        width: '67%'
    },
    itemStyle: {
        justifyContent: 'center',
        borderBottomWidth: .5,
        paddingVertical: 8,
        borderBottomColor: Constants.appColors.LIGHTGRAY
    }

});


export default AboutScreen;