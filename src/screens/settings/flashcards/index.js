import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch,Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from "../../../components/button/CustomButton";
import PouchDB from 'pouchdb-react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationActions, NavigationEvents } from 'react-navigation';
import Constants from '../../../utills/Constants';
import Sizes from '../../../utills/Size';
import AntDesign from "react-native-vector-icons/AntDesign";
import {
    NAVIGATION_FLASHCARD_RENDER_LISTS_SCREEN_PATH
} from '../../../navigations/Routes'
PouchDB.plugin(require('pouchdb-find'));
var userDB = new PouchDB('usersettings');

const FlashcardListsScreen = (props) => {


    const { t, i18n } = useTranslation();
    const userSetting = props.navigation.getParam('userSettings', 'nothing sent');
    const [userSettings, setUserSettings] = useState(userSetting)
    const [defaultCategoryTapHoldSection, setDefaultCategoryTapHoldSection] = useState(userSettings?.doc?.Flashcard?.defaultCategoryTapHoldSection);
    const [promptForCategory, setPromptForCategory] = useState(userSettings?.doc?.Flashcard?.promptForCategory);
    const [dailyPracticeReminder, setDailyPracticeReminder] = useState(userSettings?.doc?.Flashcard?.dailyPracticeReminder);
    const [updated, setUpdated] = useState(false)


    //fetch user data
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

    //toggle user settings data 
    const toggleSwitch = (id) => {
        if (id == 1) {
            setDefaultCategoryTapHoldSection(previousState => !previousState)
            setUpdated(true)
        }
        else if (id == 2) {
            setPromptForCategory(previousState => !previousState)
            setUpdated(true)
        }
        else if (id == 3) {
            setDailyPracticeReminder(previousState => !previousState)
            setUpdated(true)
        }
    };

    //handel reset scores data of the user
    const handelResetButton = () => {
        // console.log('reset settings')
        Alert.alert(
            `${t("ResetSpacedRepetitionScoresTitleText")}`,
            `${t("ResetSpacedRepetitionScoresDecsText")}`,
            [
              {
                text: `${t("CancelText")}`,
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: `${t("ResetScoresText")}`, onPress: () => console.log("Reset scores Pressed") }
            ])
    }


    //update user settings
    function updateUserSettings() {
        userDB.get(userSettings.id).then(function (doc) {
            let newObject = {
                ...doc,
                "Flashcard": {
                    ...doc?.Flashcard,
                    defaultCategoryTapHoldSection,
                    promptForCategory,
                    dailyPracticeReminder
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
            <NavigationEvents onDidFocus={(payload) => { fetchUserSettings() }} />
            <View style={styles.container}>
                <View style={{ width: 100, left: -4, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.dispatch(NavigationActions.back())}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>{`${t("ProfileText")}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textStyle}>{`${t("FlashcardsText")}`}</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
                <View style={{ marginTop: 8, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate(NAVIGATION_FLASHCARD_RENDER_LISTS_SCREEN_PATH, { userSettings })}>
                        <View style={styles.itemStyle}>
                            <Text style={styles.textStyle2}>{`${t("DefaultSaveCategoryText")}`}</Text>
                            <View style={styles.MenuItemIconStyle}>{userSettings && <Text>{userSettings?.doc?.Flashcard?.defaultFlashcard}</Text>}<AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("ChangeDefaultCategoryText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(1)}
                            value={defaultCategoryTapHoldSection}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>

                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("AlwaysPromptCategoryText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(2)}
                            value={promptForCategory}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("DailyPracticeReminderText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(3)}
                            value={dailyPracticeReminder}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <Text style={[styles.textStyle2, { zIndex: 4 }]}>{`${t("ReminderTimeText")}`}</Text>
                        <Text style={{ marginRight: 8, fontWeight: 'bold', color: Constants.appColors.BLACK, fontSize: 16 }}>17:00</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:12 }}>
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`${t("ResetToDefaultSettingsText")}`}
                    titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                    onPress={handelResetButton}
                />
            </View>
            </View>
        </View>
    )
}

FlashcardListsScreen.navigationOptions = {
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

export default FlashcardListsScreen;