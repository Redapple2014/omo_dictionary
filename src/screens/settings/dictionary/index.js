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
import PouchDB from 'pouchdb-react-native';
import { NavigationEvents } from 'react-navigation';

var userDB = new PouchDB('usersettings');

const DictionaryScreen = (props) => {

    const userSetting = props.navigation.getParam('userSettings', 'nothing sent');
    const { t, i18n } = useTranslation();
    const [userSettings, setUserSettings] = useState(userSetting)
    const [showKoreanDefinition, setShowKoreanDefinition] = useState(userSettings?.doc?.Dictionary?.showKoreanDefinition);
    const [showExamples, setShowExamples] = useState(userSettings?.doc?.Dictionary?.showExamples);
    const [displayRomaja, setDisplayRomaja] = useState(userSettings?.doc?.Dictionary?.displayRomaja);
    const [displayTranslatorExample, setDisplayTranslatorExample] = useState(userSettings?.doc?.Dictionary?.displayTranslatorExample);
    const [updated, setUpdated] = useState(false)

    const toggleSwitch = (id) => {
        if (id == 1) {
            setShowKoreanDefinition(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 2) {
            setShowExamples(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 3) {
            setDisplayRomaja(previousState => !previousState)
            setUpdated(true)

        }
        else if (id == 4) {
            setDisplayTranslatorExample(previousState => !previousState)
            setUpdated(true)

        }

    };

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


    function updateUserSettings() {
        userDB.get(userSettings.id).then(function (doc) {
            let newObject = {
                ...doc,
                "Dictionary": {
                    ...doc?.Dictionary,
                    showKoreanDefinition: showKoreanDefinition,
                    showExamples: showExamples,
                    displayRomaja: displayRomaja,
                    displayTranslatorExample: displayTranslatorExample
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

    updated && updateUserSettings()

    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => fetchUserSettings()} />
            <View style={styles.container}>
                <View style={{ width: 100, left: -4, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>{`${t("ProfileText")}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.textStyle, { marginLeft: 0 }]}>{`${t("DictionaryText")}`}</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate(NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH, { "from": "dictionary", userSettings })}>
                        <View style={styles.itemStyle}>
                            <Text style={styles.textStyle2}>{`${t("DictionaryLanguageText")}`}</Text>
                            <View style={styles.MenuItemIconStyle}>{userSettings && <Text>{userSettings?.doc?.Dictionary?.language?.label}</Text>}<AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("DisplayKoreanDefinitionsText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(1)}
                            value={showKoreanDefinition}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("ShowExampleSentencesByDefaultText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(2)}
                            value={showExamples}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("DisplayRomajaText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(3)}
                            value={displayRomaja}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("DisplayExampleSentenceTranslationsText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(4)}
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

export default DictionaryScreen;