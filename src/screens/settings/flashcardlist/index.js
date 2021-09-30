import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import PouchDB from 'pouchdb-react-native';
import Constants from '../../../utills/Constants';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions } from 'react-navigation';
import { NavigationEvents } from 'react-navigation';
import Sizes from '../../../utills/Size'
import MIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from "react-native-vector-icons/AntDesign";
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
import { getStatusBarHeight } from "react-native-status-bar-height";
PouchDB.plugin(require('pouchdb-find'));

//db instance with db_name
var localDB = new PouchDB('flashcard');
var userDB = new PouchDB('usersettings');

import {
    NAVIGATION_FLASHCARD_SCREEN_PATH
} from '../../../navigations/Routes';

const FlashcardListRenderScreen = (props) => {

    const userSetting = props.navigation.getParam('userSettings', 'nothing sent');
    console.log(userSetting)
    const { t, i18n } = useTranslation();
    const [userSettings, setUserSettings] = useState(userSetting)
    const [myData, setData] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [categoryName, setCategoryName] = useState(userSetting?.doc?.Flashcard?.defaultFlashcard)
    const [updated, setUpdated] = useState(false)

    //fetch all flashcard data
    async function fetchData() {
        localDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    setData([]);
                    return console.log(err);
                }
                // handle result
                setData(response.rows);
                // console.log("fetched data ", response.rows)
                return response.rows;

            },
        );
    }


    //fetch user settings data
    async function fetchUserSettings() {
        userDB.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    setUserSettings({})
                    return console.log(err);
                }

                // console.log("user settings data ", JSON.stringify(response.rows[0].doc.Dictionary))
                setUserSettings(response.rows[0])
                return response.rows[0];

            },
        );
    }

    //update user settings data
    function updateUserSettings() {
        userDB.get(userSettings.id).then(function (doc) {
            let newObject = {
                ...doc,
                "Flashcard": {
                    ...doc?.Flashcard,
                    defaultFlashcard: categoryName,
                }
            }

            console.log('new obj doc : ', JSON.stringify(newObject))
            userDB.put(newObject).then((response) => {
                console.log('responcen : ', response)
                //goBack()
                // fetchUserSettings()
            }).catch((e) =>
                console.log('ERORor: ', e))
        }).catch(function (err) {
            console.log('EROR : ', err);
        });

    }


    //render flashcards with dragable feature
    const renderItem = ({ item, index, move, moveEnd, isActive }) => {
        // console.log(categoryName ,  item.doc.name)
        return (
            <TouchableOpacity
                onPress={() => { setUpdated(true); setCategoryName(item.doc.name) }}
                onLongPress={move}
                onPressOut={moveEnd}>
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                        style={{
                            width: editMode ? Sizes.WINDOW_WIDTH - 48 : Sizes.WINDOW_WIDTH,
                            backgroundColor: isActive ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.WHITE,
                            alignItems: 'center',
                            paddingVertical: 8,
                            flexDirection: 'row',
                            borderBottomWidth: 0.5,
                            borderBottomColor: Constants.appColors.LIGHTGRAY
                        }}>

                        <View>
                            <Text style={{
                                fontWeight: '700',
                                color: Constants.appColors.BLACK,
                                fontSize: 18,
                                paddingLeft: editMode ? 48 : 28
                            }}>{item?.doc?.name}</Text>
                            <Text style={{ paddingLeft: editMode ? 48 : 28 }}>{item?.doc?.cards.length}{` ${t("CardsText")}`}</Text>
                        </View>
                    </View>
                    {
                        categoryName == item.doc.name && <View style={{ position: 'absolute', right: 16 }}><AntDesign name='checkcircle' color={Constants.appColors.PRIMARY_COLOR} size={20} /></View>
                    }
                </View>
            </TouchableOpacity>
        )
    }

    updated && updateUserSettings()

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => { fetchData(); fetchUserSettings() }} />
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                    <View style={{ width: 100, left: 0, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                            <View style={{ flexDirection: 'row' }}>
                                <Icon name='chevron-back-sharp' size={20} color={Constants.appColors.WHITE} />
                                <Text style={{ fontSize: 16, color: 'white' }}>{`${t("FlashcardsText")}`}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textStyle}>{`${t("DefaultCategoryText")}`}</Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                {
                    myData.length > 0 ? <FlatList
                        data={myData}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.key}`}
                    />
                        : (<>
                            <Text style={{ textAlign: 'center', marginTop: 24 }}>{`${t("NoCategoryFoundText")}`}</Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate(NAVIGATION_FLASHCARD_SCREEN_PATH)}>
                                <Text style={{ textAlign: 'center', marginTop: 12, fontWeight: 'bold' }}>{`${t("CreateNewText")}`}</Text>
                            </TouchableOpacity></>
                        )
                }
            </View>
        </View>
    )
}


FlashcardListRenderScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardListRenderScreen;


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
    itemStyle: {
        justifyContent: 'center',
        borderBottomWidth: .5,
        paddingVertical: 8,
        borderBottomColor: Constants.appColors.LIGHTGRAY
    }

});