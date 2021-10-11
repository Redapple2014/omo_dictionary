import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-simple-toast';
import CustomButton from "../../components/button/CustomButton";
import Sizes from '../../utills/Size';
const pkg = require('../../../package.json');


const BuyProScreen = (props) => {

    const { t, i18n } = useTranslation();

    //go back handeller
    const goBack = () => props.navigation.dispatch(NavigationActions.back())

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../assets/logo/name_logo.png')} style={{ resizeMode: 'contain', width: 120, height: 45 }} />
                        <View style={{ width: 60, height: 28, backgroundColor: Constants.appColors.SKY_COLOR, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginLeft: 8 }}>
                            <Text style={{ textAlign: 'center', color: Constants.appColors.WHITE, fontWeight: 'bold', fontSize: 18 }}>Pro</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', paddingVertical: 12, backgroundColor: "white" }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: Sizes.WINDOW_WIDTH, paddingHorizontal: 12 }}>
                        <View style={{ alignItems: 'center' }}>
                            <CustomButton
                                style={{ height: 35, width: Sizes.WINDOW_WIDTH / 2 - 24, backgroundColor: `#54E346`, borderRadius: 10 }}
                                title={`Lifetime Subscription`}
                                titleStyle={{ fontSize: 14, color: Constants.appColors.WHITE, fontWeight: 'bold' }}
                                onPress={() => { }}
                            />
                            <Text style={{ marginVertical: 6 }}>One-time price of $30</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <CustomButton
                                style={{ height: 35, width: Sizes.WINDOW_WIDTH / 2 - 24, backgroundColor: `#54E346`, borderRadius: 10 }}
                                title={`Monthly Subscription`}
                                titleStyle={{ fontSize: 14, color: Constants.appColors.WHITE, fontWeight: 'bold' }}
                                onPress={() => { }}
                            />
                            <Text style={{ marginVertical: 6 }}>Monthly price of $6</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: Constants.appColors.SKY_COLOR }}>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ width: 70, height: 150, resizeMode: 'center' }} source={require('../../assets/logo/white-bookmark.png')} />
                        <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
                            <Text style={{ fontSize: 24, color: 'white', fontWeight: '700' }}>Flashcards</Text>
                            <Text style={{ marginTop: 4, fontSize: 16, color: 'white' }}>{`Flashcard manager,testing,\ntranslations, syncing, and more`}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, height: Platform.OS == 'ios' ? 60 : 45 }}>
                    <TouchableOpacity onPress={goBack}>
                        <Text style={{ textAlign: 'right', marginRight: 12, marginTop: 8, color: Constants.appColors.WHITE, fontSize: 17, fontWeight: 'bold' }}>Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}


BuyProScreen.navigationOptions = {
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


export default BuyProScreen;