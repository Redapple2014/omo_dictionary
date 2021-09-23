import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StatusBar, TouchableOpacity, Platform } from 'react-native';
import CustomHeader from "../../components/header";
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecureOldPassword, setIsSecureOldPassword] = useState(true);
    const [isSecureNewPassword, setIsSecureNewPassword] = useState(true);
    const [isSecureConfirmPassword, setIsSecureConfirmPassword] = useState(true);
    const { t,i18n } = useTranslation();
    const oldPasswordInputRef = useRef(null);
    const newPasswordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);


    const onSavePress = () => {
        console.log('save new password pressed')
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("PasswordText")}`}
                    leftIcon={`${t('CancelText')}`}
                    onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                    rightIcon={`${t('SaveText')}`}
                    onPressrightIcon={onSavePress}
                />
            </View>
            <CustomInput
                label={`${t("OldPasswordText")}`}
                ref={oldPasswordInputRef}
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400',marginLeft:4 }}
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
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400',marginLeft:4 }}
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
                }}
                containerStyle={{ height: 50, marginTop: 32 }}
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
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400',marginLeft:4 }}
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
                }}
                containerStyle={{ height: 50, marginTop: 32 }}
                onSubmitEditing={onSavePress}
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
