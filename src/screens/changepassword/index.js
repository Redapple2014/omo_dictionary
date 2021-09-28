import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import CustomHeader from "../../components/header";
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utills/Constants';
import Verify from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import database from '@react-native-firebase/database';
import base64 from 'react-native-base64';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import {
    NAVIGATION_PROFILE_SCREEN_PATH
} from '../../navigations/Routes';


const ChangePasswordScreen = (props) => {
    const [userData, setUserdata] = useState({})
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecureOldPassword, setIsSecureOldPassword] = useState(true);
    const [isSecureNewPassword, setIsSecureNewPassword] = useState(true);
    const [isSecureConfirmPassword, setIsSecureConfirmPassword] = useState(true);
    const [isNewPasswordErrorMsg, setIsNewPasswordErrorMsg] = useState(false);
    const [isConPasswordErrorMsg, setIsConPasswordErrorMsg] = useState(false);
    const { t, i18n } = useTranslation();
    const oldPasswordInputRef = useRef(null);
    const newPasswordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    //get data of loged in user
    const getData = () => {
        if (auth().currentUser) {
            const userId = auth().currentUser.uid;
            database()
                .ref("users/" + userId)
                .once("value", function (snapshot) {
                    if (snapshot.val() != null) {
                        const userData = snapshot.val()
                        setUserdata(userData)
                    }
                });
        }
    }


//Log out function
    const OnLogOutPress = () => {
        auth()
            .signOut()
            .then(() => {

            });
    }

//update the user password
    const updateUserData = () => {
        if (newPassword == confirmPassword) {
            if (userData.password == base64.encode(oldPassword)) {
                var uid = auth()?.currentUser.uid;
                const jsonData = {
                    password: base64.encode(newPassword),
                    uid
                }
                try {
                    database()
                        .ref('users/' + uid)
                        .set({ ...userData, ...jsonData })
                        .then(() => {
                            auth().currentUser.updatePassword(newPassword).then(() => {
                                console.log('User password updated successfully!');
                                setToDefalult()
                                props.navigation.navigate(NAVIGATION_PROFILE_SCREEN_PATH)
                                OnLogOutPress()
                            }).catch((error) => { console.log(error); });
                        });
                } catch (error) {
                    console.log('error====>> ', error);
                }


            } else {
                Toast.show(`${t("OldPasswordMismatch")}`, Toast.SHORT)
            }
        } else {
            Toast.show(`${t("PasswordChangeMismatchText")}`, Toast.SHORT)
        }
    }


//clear all the input fields
    function setToDefalult() {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("PasswordText")}`}
                    leftIcon={`${t('CancelText')}`}
                    onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                    rightIcon={`   ${t('SaveText')}`}
                    onPressrightIcon={updateUserData}
                />
            </View>
            <CustomInput
                label={`${t("OldPasswordText")}`}
                ref={oldPasswordInputRef}
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400', marginLeft: 4 }}
                autoCapitalize='none'
                returnKeyType='next'
                autoCorrect={false}
                inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0, color: 'red' }}
                keyboardType="default"
                RightIconContainerStyle={{ marginLeft: 16 }}
                placeholderTextColor={Constants.appColors.LIGHTGRAY}
                placeholderFontSize={10}
                placeholder=""
                secureTextEntry={isSecureOldPassword ? isSecureOldPassword : false}
                value={oldPassword}
                onChangeText={value => {
                    setOldPassword(value)
                }}
                containerStyle={{ height: 50, marginTop: 8 }}
                onSubmitEditing={() => newPasswordInputRef.current.focus()}
                rightIcon={
                    <TouchableOpacity onPress={() => setIsSecureOldPassword(!isSecureOldPassword)}>
                        <Icon
                            name={oldPassword && isSecureOldPassword ? 'eye-sharp' : 'eye-off-sharp'}
                            size={24}
                            color={Constants.appColors.TEXT_INPUT}
                        /></TouchableOpacity>}
            />
            <CustomInput
                label={`${t("NewPasswordText")}`}
                ref={newPasswordInputRef}
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400', marginLeft: 4 }}
                autoCapitalize='none'
                returnKeyType='next'
                autoCorrect={false}
                inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0, color: 'red' }}
                keyboardType="default"
                RightIconContainerStyle={{ marginLeft: 16 }}
                placeholderTextColor={Constants.appColors.LIGHTGRAY}
                placeholderFontSize={10}
                placeholder=""
                secureTextEntry={isSecureNewPassword ? isSecureNewPassword : false}
                value={newPassword}
                onChangeText={value => {
                    setNewPassword(value)
                    setIsNewPasswordErrorMsg(Verify.varifyPassword(value));
                }}
                containerStyle={{ height: 50, marginVertical: 32 }}
                errorMessage={
                    newPassword && !isNewPasswordErrorMsg ? `${t('PasswordInvalidText')}` : ''
                }
                onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
                rightIcon={
                    <TouchableOpacity onPress={() => setIsSecureNewPassword(!isSecureNewPassword)}>
                        <Icon
                            name={newPassword && isSecureNewPassword ? 'eye-sharp' : 'eye-off-sharp'}
                            size={24}
                            color={Constants.appColors.TEXT_INPUT}
                        /></TouchableOpacity>}
            />
            <CustomInput
                label={`${t("ConfirmPasswordText")}`}
                ref={confirmPasswordInputRef}
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400', marginLeft: 4 }}
                autoCapitalize='none'
                returnKeyType='next'
                autoCorrect={false}
                inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0, color: 'red' }}
                keyboardType="default"
                RightIconContainerStyle={{ marginLeft: 16 }}
                placeholderTextColor={Constants.appColors.LIGHTGRAY}
                placeholderFontSize={10}
                placeholder=""
                secureTextEntry={isSecureConfirmPassword ? isSecureConfirmPassword : false}
                value={confirmPassword}
                onChangeText={value => {
                    setConfirmPassword(value)
                    setIsConPasswordErrorMsg(Verify.varifyPassword(value));
                }}
                containerStyle={{ height: 50, marginTop: 32 }}
                onSubmitEditing={() => { }}
                errorMessage={
                    confirmPassword && !isConPasswordErrorMsg ? `${t('PasswordInvalidText')}` : ''
                }
                rightIcon={
                    <TouchableOpacity onPress={() => setIsSecureConfirmPassword(!isSecureConfirmPassword)}>
                        <Icon
                            name={confirmPassword && isSecureConfirmPassword ? 'eye-sharp' : 'eye-off-sharp'}
                            size={24}
                            color={Constants.appColors.TEXT_INPUT}
                        /></TouchableOpacity>}
            />
        </View>
    )
}

ChangePasswordScreen.navigationOptions = {
    headerShown: false
}


export default ChangePasswordScreen;
