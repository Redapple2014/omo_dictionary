import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Alert, Share } from 'react-native';
import CustomButton from "../../components/button/CustomButton";
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import { getStatusBarHeight } from "react-native-status-bar-height";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {
    NAVIGATION_SIGNUP_SCREEN_PATH,
    NAVIGATION_LOGIN_SCREEN_PATH,
    NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH,
    NAVIGATION_DICTIONARY_SETTINGS_SCREEN_PATH,
    NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH,
    NAVIGATION_EDIT_PROFILE_SCREEN_PATH
} from '../../navigations/Routes';
import EIcons from 'react-native-vector-icons/Entypo';
import { useTranslation } from 'react-i18next';
import { userMenu1, userMenu2, defaultSettings } from '../../utills/userdata';
import AntDesign from "react-native-vector-icons/AntDesign";
import PouchDB from 'pouchdb-react-native';
import { NavigationEvents } from 'react-navigation';
import Toast from 'react-native-simple-toast';
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from 'react-native-image-picker';
import Dialog from "react-native-dialog";
import Rate, { AndroidMarket } from 'react-native-rate'
const pkg = require('../../../package.json');
PouchDB.plugin(require('pouchdb-find'));

var userDB = new PouchDB('usersettings');


const appStoreLink = "App Store Link";
const playStoreLink = "Play Store Link";

const ProfileScreen = (props) => {
    const x = props.navigation.getParam('userdata', 'nothing sent');
    const [userData, setUserdata] = useState({})
    const [profilePicDetails, setProfilePicDetails] = useState(null)
    const { t, i18n } = useTranslation();
    const [userType, setUserType] = useState(false);
    const [userSettings, setUserSettings] = useState({})
    const [visible, setVisible] = useState(false);
    const [feedbackText, setFeedbackText] = useState('')
    const [rated, setRated] = useState(false)


    const chooseFile = () => {
        let options = {
            mediaType: "photo"
        };
        launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log(
                    'User tapped custom button: ',
                    response.customButton
                );
                //Alert.alert(response.customButton);
            } else {
                let source = response;
                setProfilePicDetails(source.assets[0])
                console.log("source==>", source.assets[0])
            }
        });
    };

    function onCreateAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_SIGNUP_SCREEN_PATH);
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

                //console.log("user settings data ", JSON.stringify(response.rows[0]))
                setUserSettings(response.rows[0])
                return response.rows[0];

            },
        );
    }

    const getDatafromStorage = () => {
        AsyncStorage.getItem('user_data')
            .then(req => {
                if (!req) {
                    setUserdata('')
                    console.log('no data found on recent search')
                    return
                }
                // console.log(JSON.parse(req))
                setUserdata(JSON.parse(req))
            })
            .catch(error => console.log('error!'));
    }

    function onHaveAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH);
    };

    const handelProButton = () => {
        console.log('Upgrage to Pro')
    }

    const setLanguage = code => i18n.changeLanguage(code);

    const handelResetButton = () => {
        // console.log('reset settings')
        Alert.alert(
            `${t("ResetSettingsDefaultTitleText")}`,
            `${t("ResetSettingsDefaultDecsText")}`,
            [
                {
                    text: `${t("CancelText")}`,
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: `${t("ResetSettingsText")}`, onPress: () => {
                        userDB.get(userSettings.id).then(function (doc) {
                            const newx = {
                                ...doc,
                                ...defaultSettings
                            }
                            console.log(newx)
                            userDB.put(newx).then((response) => {
                                console.log('responcen : ', response)
                                Toast.show(`${t("SettingsResetSucessfullyText")}`, Toast.SHORT)
                                fetchUserSettings()
                                setLanguage('en')
                            }).catch((e) =>
                                console.log('ERORor: ', e))
                        }).catch(function (err) {
                            console.log('EROR : ', err);
                        });
                    }
                }
            ])
    }

    const handelMenu1Items = (item, index) => {
        if (item.id == 1) {
            props.navigation.navigate(NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH, { "from": "profile", userSettings });
        } else if (item.id == 2) {
            props.navigation.navigate(NAVIGATION_DICTIONARY_SETTINGS_SCREEN_PATH, { userSettings });
        } else if (item.id == 3) {
            props.navigation.navigate(NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH, { userSettings });
        }
    }

    const handelMenu2Items = (item, index) => {
        if (item.id == 1) {
            setVisible(true);
        } else if (item.id == 2) {
            onRatePress()
        } else if (item.id == 3) {
            onShare()
        } else if (item.id == 4) {
            Alert.alert(
                `${t("AboutText")}`,
                `${pkg.name} - ${pkg.version}`,
                [
                    {
                        text: `${t("OkText")}`,
                        onPress: () => console.log("ok Pressed"),
                        style: "ok"
                    }
                ])
        }
    }

    const handleCancel = () => {
        setFeedbackText('')
        setVisible(!visible);
    };

    const handleSend = () => {
        if (feedbackText.length > 0) {
            console.log('name : ', feedbackText)
            setVisible(!visible);
            setFeedbackText('')
        } else {
            Toast.show(`${t("InputEmptyText")}`, Toast.SHORT);
        }
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                title: `${t("ShareText")}`,
                message: `${t("PleaseInstallText")} ${pkg.name},\n${t("AppLinkText")}${Platform.OS == "ios" ? appStoreLink : playStoreLink}`,
                url: `${Platform.OS == 'ios' ? appStoreLink : playStoreLink}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    console.log('shared via : ', result.activityType)
                } else {
                    // shared
                    console.log('shared')
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
                console.log('dismissed')
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const onRatePress = () => {
        const options = {
            AppleAppID: "2193813192",
            GooglePackageName: pkg.pkgName,
            OtherAndroidURL: playStoreLink,
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: false,
            openAppStoreIfInAppFails: true,
            fallbackPlatformURL: "gg",
        }
        Rate.rate(options, (success, errorMessage) => {
            if (success) {
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                setRated(true)
            }
            if (errorMessage) {
                // errorMessage comes from the native code. Useful for debugging, but probably not for users to view
                console.error(`Example page Rate.rate() error: ${errorMessage}`)
            }
        })
    }

    const onEditProfile = () => {
        props.navigation.navigate(NAVIGATION_EDIT_PROFILE_SCREEN_PATH);
    }

    useEffect(() => {
        try {
            getDatafromStorage()
        } catch (e) {
            console.log(e)
        }
    })

    return (
        <View style={{ flex: 1, }}>
            <NavigationEvents onDidFocus={(payload) => fetchUserSettings()} />
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                    <View style={{ width: 100, right: -24, top: 16, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {
                            auth().currentUser?.uid && <TouchableOpacity onPress={onEditProfile}>
                                <View style={{ flexDirection: 'row' }}>
                                    <EIcons name='edit' size={20} color={Constants.appColors.WHITE} />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                    <Text style={styles.textStyle}>{`${t("ProfileText")}`}</Text>
                </View>
            </View>
            <ScrollView>
                {
                    userData && auth().currentUser?.uid ? <View style={{ paddingHorizontal: 12, justifyContent: 'space-between', flexDirection: 'row' }}>

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={chooseFile}>
                                <View style={{ width: 100, borderRadius: 50, height: 100, marginTop: 16, marginBottom: 8 }}>
                                    {
                                        profilePicDetails === null ? <Image source={require('../../assets/images/profile_pic.png')} style={[{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' }]} /> : <Image source={{ uri: profilePicDetails.uri, }} style={[{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }]} />
                                    }
                                    <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', top: 72, left: 64, zIndex: 2 }}>
                                        <EIcons name='edit' size={16} color='white' />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingVertical: 12, alignItems: 'flex-end' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                {
                                    userType ? <View style={styles.userLabelText}><Text style={{ color: Constants.appColors.WHITE, textAlign: 'center' }}>Pro</Text></View> : <View style={[styles.userLabelText, { backgroundColor: Constants.appColors.GRAY }]}><Text style={{ color: Constants.appColors.WHITE, textAlign: 'center' }}>Basic</Text></View>
                                }
                                <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right' }}>    {userData?.displayName}</Text>
                            </View>
                            <Text style={{ fontSize: 15, textAlign: 'right' }}>userName</Text>
                            <Text style={{ fontSize: 15 }}>{userData?.email}</Text>
                        </View>
                    </View>
                        :
                        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                            <CustomButton
                                style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.PRIMARY_COLOR, marginBottom: 8, borderRadius: 10 }}
                                title={`${t("createAccountTitleText")}`}
                                titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                                onPress={onCreateAccountButtonPress}
                            />
                            <CustomButton
                                style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                                title={`${t("haveAccountTitleText")}`}
                                titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                                onPress={onHaveAccountButtonPress}
                            />
                        </View>
                }
                {
                    !userType &&
                    <TouchableOpacity onPress={handelProButton}>
                        <View style={styles.userTypeViewStyle}>
                            <Text style={styles.userTypeTextStyle}>{`${t("ProText")}`}</Text>
                            <Text style={[styles.userTypeTextStyle, { fontSize: 11 }]}>{`${t("ProTagText")}`}</Text>
                        </View>
                    </TouchableOpacity>
                }
                <View style={[styles.Settings, { marginTop: userType ? 16 : 0 }]}>
                    <FlatList
                        data={userMenu1}
                        keyboardShouldPersistTaps={'handled'}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handelMenu1Items(item, index)}>
                                <View style={styles.MenuItems}>
                                    <Text style={styles.MenuItemTextStyle}>{`${t(item.label)}`}</Text>
                                    <View style={styles.MenuItemIconStyle}>{userSettings && item.id == 1 && <Text>{userSettings?.doc?.DisplayLanguage?.label}</Text>}<AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <View style={[styles.Settings, { marginVertical: 12 }]}>
                    <FlatList
                        data={userMenu2}
                        keyboardShouldPersistTaps={'handled'}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={() => handelMenu2Items(item, index)}>
                                <View style={styles.MenuItems}>
                                    <Text style={styles.MenuItemTextStyle}>{item.id == 2 ? `${t(item.alter)}` : `${t(item.label)}`}</Text>
                                    <View style={styles.MenuItemIconStyle}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18} /></View>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                    />
                    {visible &&
                        <Dialog.Container visible={visible}>
                            <Dialog.Title>{`${t("YourFeedbackText")}`}</Dialog.Title>
                            <Dialog.Input value={feedbackText} onChangeText={(v) => setFeedbackText(v)} />
                            <Dialog.Button label={`${t("CancelText")}`} onPress={handleCancel} />
                            <Dialog.Button label={`${t("SendText")}`} onPress={handleSend} />
                        </Dialog.Container>
                    }
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CustomButton
                        style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                        title={`${t("ResetToDefaultSettingsText")}`}
                        titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                        onPress={handelResetButton}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: Constants.appColors.BUTTON_COLOR
    },
    Settings: {
        marginHorizontal: 16,
        backgroundColor: Constants.appColors.WHITE,
        borderRadius: 15,
        padding: 12
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
    MenuItemTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK
    },
    userTypeViewStyle: {
        backgroundColor: Constants.appColors.SKY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8
    },
    userTypeTextStyle: {
        fontSize: 19,
        color: Constants.appColors.WHITE
    },
    userLabelText: {
        backgroundColor: Constants.appColors.SKY_COLOR,
        width: 60,
        paddingVertical: 2,
        borderRadius: 10,
    },
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
    }
});

export default ProfileScreen;
