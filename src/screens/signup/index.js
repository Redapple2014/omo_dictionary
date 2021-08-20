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
import { launchImageLibrary } from 'react-native-image-picker';
import { getStatusBarHeight } from "react-native-status-bar-height";
import auth from '@react-native-firebase/auth';
import {
    NAVIGATION_LOGIN_SCREEN_PATH
} from '../../navigations/Routes';

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
    const [profilePicDetails, setProfilePicDetails] = useState(null)
    const [loading, SetLoading] = useState(false)

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

    function setToDefalult() {
        setName('');
        setUsername('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    const registerUser = () => {
        if (email.length == 0 || password.length == 0 || name.length == 0 || username == 0) {
            alert('Enter details to signup!')
        } else if (password != confirmPassword) {
            alert('Password mismatch')
        }
        else if (!Verify.varifyPassword(password) || !Verify.varifyEmail(email)) {
            alert('Enter a valid email/password')
        }
        else {
            SetLoading(true)
            auth()
              .createUserWithEmailAndPassword(email,password)
              .then((res) => {
                res.user.updateProfile({
                displayName:name,
                })
                setToDefalult()
                console.log('User registered successfully!')
                props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH)
              })
              .catch(error => alert('Unable to register. Check Your Internet Connection'))      
            console.log('suc')
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='New Account'
                    leftIcon='Cancel'
                    onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 100, borderRadius: 50, height: 100, marginTop: 16, marginBottom: 8 }}>
                        {
                            profilePicDetails === null ? <Image source={require('../../assets/images/profile_pic.png')} style={[{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' }]} /> : <Image source={{ uri: profilePicDetails.uri, }} style={[{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }]} />
                        }
                        <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', top: 72, left: 64, zIndex: 2 }}>
                            <TouchableOpacity onPress={chooseFile}>
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
                    placeholder="Re-enter Password"
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
                        onPress={registerUser}
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
