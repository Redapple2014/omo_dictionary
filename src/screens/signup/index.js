import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native';
import CustomHeader from "../../components/header";
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from "../../components/button/CustomButton";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import Verify from '../../utills/Validation';
import CustomInput from "../../components/input/CustomInput";
import { NavigationActions } from 'react-navigation';
import EIcons from 'react-native-vector-icons/Entypo';
const SinupScreen = (props) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecurePassword, setIsSecurePassword] = useState(true);
    const [isSecureConPassword, setIsSecureConPassword] = useState(true);
    const [isEmailErrorMsg, setIsEmailErrorMsg] = useState(false);
    const [isPasswordErrorMsg, setIsPasswordErrorMsg] = useState(false);

    return (
        <View style={{ flex: 1 }}>
            <CustomHeader
                title='New Account'
                leftIcon='Cancel'
                onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ flex: .25, marginTop: 16, marginBottom: 8 }}>
                        <Image source={require('../../assets/images/profile_pic.png')} style={[{ width: 100, borderColor: 50, height: 100, resizeMode: 'contain' }]} />
                        <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', top: 72, left: 64, zIndex: 2 }}>
                            <TouchableOpacity onPress={() => console.log('pressed')}>
                                <EIcons name='edit' size={16} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <CustomInput
                    label='Name'
                    labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter your name'
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
                />
                <CustomInput
                    label='Username'
                    labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter your username'
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
                />
                <CustomInput
                    label='Email'
                    labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter your email'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={2}
                    containerStyle={{ height: 50, marginTop: 32 }}
                    value={email}
                    onChangeText={
                        value => {
                            setEmail(value);
                            setIsEmailErrorMsg(Verify.varifyEmail(value));
                        }
                    }
                    errorMessage={email && !isEmailErrorMsg ? 'Email Id is invalid' : ''}
                />

                <CustomInput
                    label='Password'
                    labelStyle={{ fontSize: 14, marginBottom: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0, color: 'red' }}
                    keyboardType="default"
                    RightIconContainerStyle={{ marginLeft: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={10}
                    placeholder="Enter Password"
                    secureTextEntry={isSecurePassword ? isSecurePassword : false}
                    value={password}
                    onChangeText={value => {
                        setPassword(value)
                        setIsPasswordErrorMsg(Verify.varifyPassword(value))
                    }}
                    errorStyle={{ color: Constants.appColors.PRIMARY_COLOR }}
                    containerStyle={{ height: 50, marginTop: 52 }}
                    errorMessage={password && !isPasswordErrorMsg ? 'Password is invalid' : ''}
                    onSubmitEditing={() => console.log('submit log in')}
                    rightIcon={
                        <TouchableOpacity onPress={() => setIsSecurePassword(!isSecurePassword)}>
                            <Icon
                                name={password && isSecurePassword ? 'eye-sharp' : 'eye-off-sharp'}
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
                    placeholder="Enter Password"
                    secureTextEntry={isSecureConPassword ? isSecureConPassword : false}
                    value={confirmPassword}
                    onChangeText={value => {
                        setConfirmPassword(value)
                    }}
                    containerStyle={{ height: 50, marginTop: 52, marginBottom: 42 }}
                    onSubmitEditing={() => console.log('submit log in')}
                    rightIcon={
                        <TouchableOpacity onPress={() => setIsSecureConPassword(!isSecureConPassword)}>
                            <Icon
                                name={confirmPassword && isSecureConPassword ? 'eye-sharp' : 'eye-off-sharp'}
                                size={24}
                                color={Constants.appColors.TEXT_INPUT}
                            /></TouchableOpacity>}
                />
                <View style={{ alignItems: 'center' }}>
                    <CustomButton
                        style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.BUTTON_COLOR, marginBottom: 8, borderRadius: 10 }}
                        title={`${Constants.createYourAccountText}`}
                        titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                        onPress={() => console.log('create account Press')}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

SinupScreen.navigationOptions = {
    headerShown: false
}


export default SinupScreen;
