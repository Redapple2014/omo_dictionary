import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import CustomHeader from "../../components/header";
import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';


const ForgetPasswordScreen = (props) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [isSecureOldPassword, setIsSecureOldPassword] = useState(true);
    const [isSecureNewPassword, setIsSecureNewPassword] = useState(true);
    const [isSecureConfirmPassword, setIsSecureConfirmPassword] = useState(true);

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                title='Password'
                leftIcon='Cancel'
                onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                rightIcon='Save'
                onPressrightIcon={()=>console.log('save button')}
            />
            <CustomInput
                label='Old Password'
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
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
                containerStyle={{ height: 50,marginTop:8 }}
                onSubmitEditing={() => console.log('submit log in')}
                rightIcon={
                    <TouchableOpacity onPress={() => setIsSecureOldPassword(!isSecureOldPassword)}>
                        <Icon
                            name={oldPassword && isSecureOldPassword ? 'eye-sharp' : 'eye-off-sharp'}
                            size={24}
                            color={Constants.appColors.TEXT_INPUT}
                        /></TouchableOpacity>}
            />
                        <CustomInput
                label='New Password'
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
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
                containerStyle={{ height: 50,marginTop:32 }}
                onSubmitEditing={() => console.log('submit log in')}
                rightIcon={
                    <TouchableOpacity onPress={() => setIsSecureNewPassword(!isSecureNewPassword)}>
                        <Icon
                            name={newPassword && isSecureNewPassword ? 'eye-sharp' : 'eye-off-sharp'}
                            size={24}
                            color={Constants.appColors.TEXT_INPUT}
                        /></TouchableOpacity>}
            />


<CustomInput
                label='Confirm Password'
                labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
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
                containerStyle={{ height: 50,marginTop:32 }}
                onSubmitEditing={() => console.log('submit log in')}
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

ForgetPasswordScreen.navigationOptions = {
    headerShown: false
}


export default ForgetPasswordScreen;
