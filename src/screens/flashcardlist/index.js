import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, FlatList, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import PouchDB from 'pouchdb-react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from "../../components/button/CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomStepper from '../../components/stepper/CustomStepper';
import { NavigationEvents } from 'react-navigation';
import {
    NAVIGATION_TEST_CATEGORY_SCREEN_PATH,
    NAVIGATION_FRONT_DISPLAY_SCREEN_PATH,
    NAVIGATION_START_TEST_SCREEN_PATH
} from '../../navigations/Routes';
import { Input } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {defaultFlashcardTestSettings} from '../../utills/userdata';
var testSettings = new PouchDB('testsettings');


const MAX_LENGTH = 100;
const MIN_LENGTH = 0;


const FlashcardListScreen = (props) => {

    const { t, i18n } = useTranslation();
    const [buttonSelected, setButtonSelected] = useState(1);
    const [limitMaxTestLength, setLimitMaxTestLength] = useState(false);
    const [limitNewCards, setLimitNewCards] = useState(false);
    const [reviewIncorrectCards, setReviewIncorrectCards] = useState(false);
    const [updated, setUpdated] = useState(false)
    const [maxLength, setMaxLength] = useState('20')
    const [flashcardTestSettings, setFlashcardTestSettings] = useState({})

    //toggle user settings data 
    const toggleSwitch = (id) => {
        if (id == 1) {
            setLimitMaxTestLength(previousState => !previousState)
            setUpdated(true)
        }
        else if (id == 2) {
            setLimitNewCards(previousState => !previousState)
            setUpdated(true)
        }
        else if (id == 3) {
            setReviewIncorrectCards(previousState => !previousState)
            setUpdated(true)
        }
    };

    const onStartTestPress = () => {
        props.navigation.navigate(NAVIGATION_START_TEST_SCREEN_PATH)
    }

    //handel reset scores data of the user
    const handelResetButton = () => {
        Alert.alert(
            `Reset Test Settings to Default`,
            `Are you sure you want to reset all of your test settings to their default values?`,
            [
                {
                    text: `${t("CancelText")}`,
                    onPress: () => console.log("Cancel Pressed"),
                },
                {
                    text: `Reset Test Settings`,
                    onPress: () => {
                        testSettings.get(flashcardTestSettings.id).then(function (doc) {
                            const newx = {
                                ...doc,
                                ...defaultFlashcardTestSettings
                            }
                            console.log(newx)
                            testSettings.put(newx).then((response) => {
                                console.log('responcen : ', response)
                                Toast.show(`${t("SettingsResetSucessfullyText")}`, Toast.SHORT)
                                getTestSettings()
                                
                            }).catch((e) =>
                                console.log('ERORor: ', e))
                        }).catch(function (err) {
                            console.log('EROR : ', err);
                        });
                    }
                }
            ])
    }

    //load user setting 
    async function getTestSettings() {
        testSettings.allDocs(
            {
                include_docs: true,
                attachments: true,
            },
            function (err, response) {
                if (err) {
                    setFlashcardTestSettings({})
                    return console.log('error ',err);
                }

                //console.log("user settings data ", JSON.stringify(response.rows))
                setFlashcardTestSettings(response.rows[0])
                setLimitMaxTestLength(response.rows[0].doc.limtMaxTestLength)
                setMaxLength(`${response.rows[0].doc.maxLength}`)
                setLimitNewCards(response.rows[0].doc.limitNewCards)
                setReviewIncorrectCards(response.rows[0].doc.reviewIncurrectAtTestEnd)
                return response.rows[0];
            },
        );
    }

    const calculateLength = (type) => {
        if (!isNaN(maxLength)) {
            if (type == 1) {
                if (maxLength == MAX_LENGTH) {
                    console.log('max reach')
                    return
                } else {
                    setMaxLength(`${parseInt(maxLength) + 1}`)
                    setUpdated(true)
                }
            } else {
                if (maxLength == MIN_LENGTH) {
                    return
                } else {
                    setMaxLength(`${parseInt(maxLength) - 1}`)
                    setUpdated(true)
                }
            }
        }
        else {
            console.log('enter a valid number')
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.id == 1) {
                        props.navigation.navigate(NAVIGATION_TEST_CATEGORY_SCREEN_PATH);
                    } else if (item.id == 2) {
                        props.navigation.navigate(NAVIGATION_FRONT_DISPLAY_SCREEN_PATH)
                    }
                }
                }>
                <View key={index} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    paddingVertical: 8,
                    marginVertical: 4,
                    borderRadius: 10,
                }}>
                    <View
                        style={{
                            width: Sizes.WINDOW_WIDTH - 64,
                            backgroundColor: Constants.appColors.WHITE,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <View>
                            <Text style={{
                                fontWeight: '700',
                                color: Constants.appColors.BLACK,
                                fontSize: 16,
                                paddingLeft: 16
                            }}>{item.label}</Text>
                            <Text style={{ paddingLeft: 16, paddingVertical: 4, color: Constants.appColors.GRAY }}>{item.details}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', right: 16 }}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={20} /></View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderList = () => {
        return (<><FlatList
            data={[{ id: 1, label: 'Test Categories', details: 'xxxxx' }, { id: 2, label: 'Flashcard Front Display', details: 'zzzzz' }]}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.details}`}
        />
            <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 8, }}>
                <View style={[styles.itemStyle, { marginBottom: 0,borderBottomWidth: limitMaxTestLength ?.5: 0}]}>
                    <Text style={styles.textStyle2}>{`Limit Max Test Length?`}</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleSwitch(1)}
                        value={limitMaxTestLength}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>
                {
                    limitMaxTestLength && 
        
                <View style={[{ flexDirection: 'row', height: 40, alignItems: 'center', marginTop: 4 }]}>
                    <Text style={[styles.textStyle2, { zIndex: 4 }]}>{`Max Test Length`}</Text>
                    <View style={{ flexDirection: 'row', width: Sizes.WINDOW_WIDTH*.4, paddingRight:8, alignItems: 'center',left:-16 }}>
                        <Input
                            onChangeText={(val) => {
                                if(val <= MAX_LENGTH && val>= MIN_LENGTH)
                                {
                                    setMaxLength(val)
                                    setUpdated(true)
                                }else{
                                    console.log('invalid')
                                    Toast.show(`Value should be between ${MIN_LENGTH} to ${MAX_LENGTH}`)
                                }
                            }
                        }
                            value={maxLength}
                            defaultValue={`${maxLength}`}
                            keyboardType='numeric'
                            inputContainerStyle={{borderBottomWidth:0,textAlign:'right'}}
                            containerStyle={{height:40,width: 55,}}
                            
                        />
                        <CustomStepper
                            containerStyle={{ width: 120, borderRadius: 5,left:-16 }}
                            onPlusPress={() => calculateLength(1)}
                            onMinusPress={() => calculateLength(2)}
                        />
                    </View>
                </View>
                        }
            </View>
            {buttonSelected == 1 &&
                <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <View style={[styles.itemStyle, {
                        marginBottom: 0, borderBottomWidth: 0,
                        paddingVertical: 8,
                    }]}>
                        <Text style={styles.textStyle2}>{`Limit New cards?`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(2)}
                            value={limitNewCards}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                </View>
            }
            <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                <View style={[styles.itemStyle, {
                    marginBottom: 0, borderBottomWidth: 0,
                    paddingVertical: 8,
                }]}>
                    <Text style={styles.textStyle2}>{`Review Incorrect at Test End?`}</Text>
                    <Switch
                        trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                        thumbColor={Constants.appColors.WHITE}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleSwitch(3)}
                        value={reviewIncorrectCards}
                        style={{ position: 'absolute', right: 0, top: 2 }}
                    />
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                <CustomButton
                    style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                    title={`Reset Test Settings to Default`}
                    titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                    onPress={handelResetButton}
                />
            </View>
        </>)
    }

    // console.log('data :',flashcardTestSettings)
    //update settings data
    function flshcardTestSettings() {
            testSettings.get(flashcardTestSettings.id).then(function (doc) {
                let newObject = {
                    ...flashcardTestSettings,
                    "doc" : {
                        ...doc,
                        limtMaxTestLength: limitMaxTestLength,
                    maxLength,
                    limitNewCards,
                    reviewIncurrectAtTestEnd:reviewIncorrectCards}
                }
                // console.log('new obj doc : ', JSON.stringify(newObject))
                
                testSettings.put(newObject.doc).then((response) => {
                    //console.log('responcen : ', response)
                    getTestSettings()
                    setUpdated(false)
                }).catch((e) =>
                    console.log('ERORor: ', e))
            }).catch(function (err) {
                console.log('EROR : ', err);
            });
    
    }

    useEffect(()=>flshcardTestSettings(),[updated])


    return (
        <View style={{ flex: 1 }}>
            <NavigationEvents onDidFocus={(payload) => getTestSettings()} />
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                   <View style={{ alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', left: 4,top:9 }}>
                            <TouchableOpacity onPress={onStartTestPress }>
                                <Text style={{color: 'white',fontSize: 18, fontWeight: '400' }}>{`Start Test`}</Text>
                            </TouchableOpacity>
                        </View>
                    <Text style={[styles.textStyle,{borderWidth:0}]}>{`${t("FlashcardListPageTitle")}`}</Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{
                    marginTop: 12,
                    justifyContent: 'space-evenly',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 3.27,
                    elevation: 5,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 10, marginHorizontal: 16, backgroundColor: Constants.appColors.WHITE }}>
                        <CustomButton
                            style={{ height: 35, borderColor: Constants.appColors.BLACK, backgroundColor: buttonSelected == 1 ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.TRANSPARENT, borderRadius: 10, width: Sizes.WINDOW_WIDTH * .32, }}
                            title='Spaced Repetition'
                            titleStyle={{ fontSize: 13, color: buttonSelected == 1 ? Constants.appColors.WHITE : Constants.appColors.BLACK, paddingHorizontal: 2 }}
                            onPress={() => {
                                setButtonSelected(1)
                            }}
                        />
                        <CustomButton
                            style={{ height: 35, borderColor: Constants.appColors.BLACK, backgroundColor: buttonSelected == 2 ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.TRANSPARENT, borderRadius: 10, width: Sizes.WINDOW_WIDTH * .32 }}
                            title='Random'
                            titleStyle={{ fontSize: 13, color: buttonSelected == 2 ? Constants.appColors.WHITE : Constants.appColors.BLACK }}
                            onPress={() => {
                                setButtonSelected(2)
                            }}
                        />
                        <CustomButton
                            style={{ height: 35, borderColor: Constants.appColors.BLACK, backgroundColor: buttonSelected == 3 ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.TRANSPARENT, borderRadius: 10, width: Sizes.WINDOW_WIDTH * .32, }}
                            title='Sequential'
                            titleStyle={{ fontSize: 13, color: buttonSelected == 3 ? Constants.appColors.WHITE : Constants.appColors.BLACK }}
                            onPress={() => {
                                setButtonSelected(3)
                            }}
                        />
                    </View>
                </View>
                <View style={{ marginHorizontal: 16, marginTop: 10 }}>
                    {renderList()}
                </View>

            </View>
        </View>
    )
}

FlashcardListScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardListScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical:8,
    },
    textStyle: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    addressContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 6,
        paddingRight: 8
    },
    itemStyle: {
        justifyContent: 'center',
        borderBottomWidth: .5,
        paddingVertical: 8,
        borderBottomColor: Constants.appColors.LIGHTGRAY
    },
    textStyle2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK,
        width: '67%'
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
})