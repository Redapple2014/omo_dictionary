import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from 'react-navigation';
import Constants from '../../../utills/Constants';
import AntDesign from "react-native-vector-icons/AntDesign";
import { languageList } from '../../../utills/userdata';

const ChooseLanguageScreen = (props) => {

    const [languageSelected, setLanguageSelected] = useState({
        id: 1,
        label: "English",
        value: ""
    })
    const { t, i18n } = useTranslation();

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
                <Text style={styles.textStyle}>Display Language</Text>
            </View>
            <View style={{ flex: 1,marginHorizontal:12 }}>
                <View style={{marginTop:12,backgroundColor:Constants.appColors.WHITE,padding:8,borderRadius:10}}>
                <FlatList data={languageList} renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => {
                        console.log(item.id);
                        setLanguageSelected(item)
                    }}>
                        <View style={styles.MenuItems}>
                            <Text style={{ marginLeft: 12,fontWeight:'bold',color:Constants.appColors.BLACK }}>{item.label}</Text>
                            {
                                languageSelected && languageSelected.id == item.id && <View style={styles.MenuItemIconStyle}><AntDesign name='checkcircle' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                            }
                        </View>
                    </TouchableOpacity>
                )} />
                </View>
            </View>
        </View>
    )
}

ChooseLanguageScreen.navigationOptions = {
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
    }

});

export default ChooseLanguageScreen;