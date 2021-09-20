import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from 'react-navigation';
import Constants from '../../../utills/Constants';
import AntDesign from "react-native-vector-icons/AntDesign";
import {
    NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH,
} from '../../../navigations/Routes';

const DictionaryScreen = (props) => {


    const { t, i18n } = useTranslation();

    const [showKoreanDefinition, setShowKoreanDefinition] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const [displayRomaja, setDisplayRomaja] = useState(false);
    const [displayTranslatorExample, setDisplayTranslatorExample] = useState(false);

    const toggleSwitch = (id) => {
        if(id==1){
            setShowKoreanDefinition(previousState => !previousState)
        }
        else if(id==2){
            setShowExamples(previousState => !previousState)
        }
        else if(id==3){
            setDisplayRomaja(previousState => !previousState)
        }
        else if(id==4){
            setDisplayTranslatorExample(previousState => !previousState)
        }

    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ width: 100, left: -4, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textStyle}>Dictionary</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={{marginTop:12,backgroundColor:Constants.appColors.WHITE,padding:8,borderRadius:10}}>
                <TouchableOpacity onPress={()=> props.navigation.navigate(NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH)}>
                <View style={styles.itemStyle}>
                    <Text style={styles.textStyle2}>Dictionary language</Text>
                    <View style={styles.MenuItemIconStyle}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={20} /></View>
                </View>
                </TouchableOpacity>
                <View style={[styles.itemStyle,{ marginBottom: 8 }]}>
                    <Text style={styles.textStyle2}>Display Korean definitions?</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSwitch(1)}
                        value={showKoreanDefinition}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>
                <View style={[styles.itemStyle,{ marginBottom: 8 }]}>
                    <Text style={styles.textStyle2}>Show example sentences by default?</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSwitch(2)}
                        value={showExamples}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>
                <View style={[styles.itemStyle,{ marginBottom: 8 }]}>
                    <Text style={styles.textStyle2}>Display romaja (Revised Romanisation)?</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSwitch(3)}
                        value={displayRomaja}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>
                <View style={[styles.itemStyle,{ marginBottom: 8 }]}>
                    <Text style={styles.textStyle2}>Display example sentence translations?</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>toggleSwitch(4)}
                        value={displayTranslatorExample}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>

            </View>
            </View>
        </View>
    )
}

DictionaryScreen.navigationOptions = {
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
        right: 12
    },
    textStyle2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK,
        width: '67%'
    },
    itemStyle:{
        justifyContent: 'center',
        borderBottomWidth:.5,
        paddingVertical:8,
        borderBottomColor:Constants.appColors.LIGHTGRAY
    }

});

export default DictionaryScreen;