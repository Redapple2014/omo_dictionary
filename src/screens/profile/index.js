import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
} from '../../navigations/Routes';
import EIcons from 'react-native-vector-icons/Entypo';

const ProfileScreen = (props) => {
    const x = props.navigation.getParam('userdata', 'nothing sent');
    const [userData, setUserdata] = useState({})
    const [profilePicDetails, setProfilePicDetails] = useState(null)
    function onCreateAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_SIGNUP_SCREEN_PATH);
    };

    const getDatafromStorage=()=> {
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

    function onHaveAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_LOGIN_SCREEN_PATH);
    };

    const OnLogOutPress = () => {
        auth()
            .signOut()
            .then(() => removeItemValue('user_data'));
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
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title='Profile'
                    rightIcon={auth().currentUser?.uid ? 'Log Out' : ''}
                    onPressrightIcon={OnLogOutPress}
                />
            </View>
            {
                userData && auth().currentUser?.uid ? <View style={{paddingHorizontal:12,justifyContent:'space-between',flexDirection:'row'}}>

                    <View style={{ width: 80, borderRadius: 40, height: 80, marginTop: 16, marginBottom: 8 }}>
                        {
                            profilePicDetails === null ? <Image source={require('../../assets/images/profile_pic.png')} style={[{ width: 80, height: 80, borderRadius: 40, resizeMode: 'contain' }]} /> : <Image source={{ uri: profilePicDetails.uri, }} style={[{ width: 100, height: 100, borderRadius: 50, resizeMode: 'cover' }]} />
                        }
                        <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, position: 'absolute', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', top: 60, left: 52, zIndex: 2 }}>
                            <TouchableOpacity onPress={() => console.log('tap')}>
                                <EIcons name='edit' size={12} color='white' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{paddingVertical:12}}>
                        <Text style={{fontSize:20,textAlign:'right'}}>{userData?.displayName}</Text>
                        <Text style={{fontSize:15}}>{userData?.email}</Text>
                    </View>
                </View> :

                    <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                        <CustomButton
                            style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.PRIMARY_COLOR, marginBottom: 8, borderRadius: 10 }}
                            title={`${Constants.createAccountTitleText}`}
                            titleStyle={{ fontSize: 14, fontWeight: 'bold' }}
                            onPress={onCreateAccountButtonPress}
                        />
                        <CustomButton
                            style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                            title={`${Constants.haveAccountTitleText}`}
                            titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                            onPress={onHaveAccountButtonPress}
                        />
                    </View>
            }
        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
}

const styles = StyleSheet.create({
    StatusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: 'red'
    }
});

export default ProfileScreen;
