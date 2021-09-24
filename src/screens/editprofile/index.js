import React, { useState, useEffect, useRef } from 'react';
import { View, StatusBar, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import { NavigationActions } from 'react-navigation';
import CustomHeader from "../../components/header";
import { useTranslation } from 'react-i18next';
import { launchImageLibrary } from 'react-native-image-picker';
import EIcons from 'react-native-vector-icons/Entypo';
import CustomInput from "../../components/input/CustomInput";
import CustomButton from "../../components/button/CustomButton";
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Octicons';
import database from '@react-native-firebase/database';
import base64 from 'react-native-base64';
import {
    NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH
} from '../../navigations/Routes'

const EditProfileScreen = (props) => {

    const { t, i18n } = useTranslation();
    const [userData, setUserdata] = useState({})
    const [name, setName] = useState(userData?.displayName);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecurePassword, setIsSecurePassword] = useState(true);
    const [profilePicDetails, setProfilePicDetails] = useState(null)
    const nameInputRef = useRef(null)
    const userNameInputRef = useRef(null)
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const confPasswordInputRef = useRef(null)

    const goBack = () => props.navigation.dispatch(NavigationActions.back());

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
                Alert.alert(response.customButton);
            } else {
                let source = response;
                setProfilePicDetails(source.assets[0])
                console.log("source==>", source.assets[0])
            }
        });
    };

    const getDatafromStorage = async () => {
        AsyncStorage.getItem('user_data')
            .then(req => {
                if (!req) {
                    setUserdata('')
                    console.log('no data found on recent search')
                    return
                }
                setUserdata(JSON.parse(req))
            })
            .catch(error => console.log('error!'));
    }

    const removeItemValue = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            setUserdata({})
            console.log('cleared')
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    const OnLogOutPress = () => {
        auth()
            .signOut()
            .then(() => {
                removeItemValue('user_data').then(() =>
                    goBack()).catch((e) => console.log(e))
            });
    }

    const getData = () => {
        if (auth().currentUser) {
            const userId = auth().currentUser.uid;
            //   console.log(userId)
            database()
                .ref("users/" + userId)
                .once("value", function (snapshot) {
                    if (snapshot.val() != null) {
                        const userData = snapshot.val()
                        setUserdata(userData)
                        setName(userData.displayName);
                        setUsername(userData.username)
                        setEmail(userData.email)
                        setPassword(base64.decode(userData.password))

                    }
                });
        }
    }


    const updateUserData = () => {
        var uid = auth()?.currentUser.uid;
        const jsonData = {
            displayName: name,
            username,
        }
        try {
            database()
                .ref('users/' + uid)
                .set({ ...userData, ...jsonData })
                .then(() => {
                    console.log('User updated successfully!');
                    goBack()
                });
        } catch (error) {
            console.log('error====>> ', error);

        }
    }

    useEffect(() => {
        // getDatafromStorage()
        getData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("UserSettingsText")}`}
                    leftIcon={`${t("CancelText")}`}
                    onPressleftIcon={goBack}
                    rightIcon={`    ${t("SaveText")}`}
                    onPressrightIcon={updateUserData}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
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



                <CustomInput
                    label={`${t("NameText")}`}
                    ref={nameInputRef}
                    labelStyle={{ fontSize: 14, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={`${t("EnterNamePlaceHolder")}`}
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={2}
                    containerStyle={{ height: 50, marginTop: 8 }}
                    value={name}
                    onChangeText={
                        value => {
                            setName(value);
                        }
                    }
                    onSubmitEditing={() => userNameInputRef.current.focus()}
                />
                <CustomInput
                    ref={userNameInputRef}
                    label={`${t("UsernameText")}`}
                    labelStyle={{ fontSize: 14, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={` ${t("EnterUsernamePlaceHolder")}`}
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={2}
                    containerStyle={{ height: 50, marginTop: 32 }}
                    value={username}
                    onChangeText={
                        value => {
                            setUsername(value);
                        }
                    }
                    onSubmitEditing={() => emailInputRef.current.focus()}
                />
                <CustomInput
                    label={`${t("EmailText")}`}
                    ref={emailInputRef}
                    labelStyle={{ fontSize: 14, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder={` ${t("EnterEmailPlaceHolder")}`}
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={2}
                    // containerStyle={{ height: 50, marginTop: 32 }}
                    containerStyle={{ height: 50, marginVertical: 36 }}
                    value={email}
                    disabled={true}
                    onChangeText={
                        value => {
                            setEmail(value);
                            //setIsEmailErrorMsg(Verify.varifyEmail(email));
                        }
                    }
                    //errorMessage={email && !isEmailErrorMsg ? `${t("EmailInvalidText")}` : ''}
                    onSubmitEditing={() => passwordInputRef.current.focus()}
                />

                {/* <CustomInput
                    label={`${t("PasswordText")}`}
                    ref={passwordInputRef}
                    labelStyle={{ fontSize: 14, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    autoCapitalize='none'
                    returnKeyType='next'
                    disabled={true}
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0, color: 'red' }}
                    keyboardType="default"
                    RightIconContainerStyle={{ marginLeft: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={10}
                    placeholder={` ${t("EnterPasswordText")}`}
                    secureTextEntry={isSecurePassword ? isSecurePassword : false}
                    value={password}
                    onChangeText={value => {
                        setPassword(value)
                    }}
                    errorStyle={{ color: Constants.appColors.PRIMARY_COLOR }}
                    containerStyle={{ height: 50, marginVertical: 36 }}
                    onSubmitEditing={() => console.log('submit log in')}
                /> */}

                <View style={{ alignItems: 'center',
            marginBottom:12 }}>
                    <CustomButton
                        title={`${t("ChangePasswordText")}`}
                        onPress={()=>props.navigation.navigate(NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH)}
                        style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.PRIMARY_COLOR, borderWidth: 1, borderColor: Constants.appColors.PRIMARY_COLOR, borderRadius: 10 }}
                        titleStyle={{ fontSize: 14, color: Constants.appColors.WHITE, fontWeight: 'bold' }}
                    />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <CustomButton
                        title={`${t("LogOutText")}`}
                        onPress={OnLogOutPress}
                        style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.WHITE, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                        titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

EditProfileScreen.navigationOptions = {
    headerShown: false
}


export default EditProfileScreen;
