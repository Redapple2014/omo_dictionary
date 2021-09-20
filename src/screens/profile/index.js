import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native';
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
    NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH
} from '../../navigations/Routes';
import EIcons from 'react-native-vector-icons/Entypo';
import { useTranslation } from 'react-i18next';
import { userMenu1, userMenu2 } from '../../utills/userdata';
import AntDesign from "react-native-vector-icons/AntDesign";

const ProfileScreen = (props) => {
    const x = props.navigation.getParam('userdata', 'nothing sent');
    const [userData, setUserdata] = useState({})
    const [profilePicDetails, setProfilePicDetails] = useState(null)
    const { t, i18n } = useTranslation();
    const [userType, setUserType] = useState(true)
    function onCreateAccountButtonPress() {
        props.navigation.navigate(NAVIGATION_SIGNUP_SCREEN_PATH);
    };

    const getDatafromStorage = () => {
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

    const handelProButton = () => {
        console.log('Upgrage to Pro')
    }

    const handelResetButton = () => {
        console.log('reset settings')
    }

    const handelMenu1Items = (item,index) => {
        if(item.id==1){
            props.navigation.navigate(NAVIGATION_CHOOSE_LANGUAGE_SCREEN_PATH);
        }else if(item.id==2){
            props.navigation.navigate(NAVIGATION_DICTIONARY_SETTINGS_SCREEN_PATH);
        }else if(item.id==3){
            props.navigation.navigate(NAVIGATION_FLASHCARD_LISTS_SCREEN_PATH);
        }
    }

    const handelMenu2Items = (item,index) => {
        console.log('handel Menu2 Items',item.id)
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
                    title={`${t("ProfileText")}`}
                    rightIcon={auth().currentUser?.uid ? 'Log Out' : ''}
                    onPressrightIcon={OnLogOutPress}
                />
            </View>
            <ScrollView>
            {
                userData && auth().currentUser?.uid ? <View style={{ paddingHorizontal: 12, justifyContent: 'space-between', flexDirection: 'row' }}>

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
                    <View style={{ paddingVertical: 12 }}>
                        {
                            userType ? <View style={styles.userLabelText}><Text style={{color:Constants.appColors.WHITE}}>Pro</Text></View> : <View style={[styles.userLabelText,{backgroundColor:Constants.appColors.GRAY}]}><Text style={{color:Constants.appColors.WHITE}}>Basic</Text></View>
                        }
                        <Text style={{ fontSize: 22,fontWeight:'bold', textAlign: 'right' }}>{userData?.displayName}</Text>
                        <Text style={{ fontSize: 15, textAlign: 'right' }}>userName</Text>
                        <Text style={{ fontSize: 15 }}>{userData?.email}</Text>
                    </View>
                </View> :

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
                userType &&
                <TouchableOpacity onPress={handelProButton}>
                    <View style={styles.userTypeViewStyle}>
                        <Text style={styles.userTypeTextStyle}>{`${t("ProText")}`}</Text>
                        <Text style={[styles.userTypeTextStyle, { fontSize: 11 }]}>{`${t("ProTagText")}`}</Text>
                    </View>
                </TouchableOpacity>
            }
            <View style={styles.Settings}>
                <FlatList
                    data={userMenu1}
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={()=>handelMenu1Items(item,index)}>
                            <View style={styles.MenuItems}>
                                <Text style={styles.MenuItemTextStyle}>{`${t(item.label)}`}</Text>
                                <View style={styles.MenuItemIconStyle}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18}/></View>
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
                        <TouchableOpacity onPress={()=>handelMenu2Items(item,index)}>
                            <View style={styles.MenuItems}>
                                <Text style={styles.MenuItemTextStyle}>{item.id==2?`${t(item.alter)}`:`${t(item.label)}`}</Text>
                                <View style={styles.MenuItemIconStyle}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={18}/></View>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                />
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
    MenuItemIconStyle:{
        position:'absolute',
        right:12
    },
    MenuItemTextStyle: {
        fontSize: 16,
        fontWeight:'bold',
        color:Constants.appColors.BLACK
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
    userLabelText:{
        backgroundColor:Constants.appColors.SKY_COLOR,
        width:'35%',
        paddingVertical:2,
        paddingHorizontal:8,
        borderRadius:10,
        position:'absolute',
        top:18,
        
    }
});

export default ProfileScreen;
