import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, FlatList,StyleSheet,Switch } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import { useTranslation } from 'react-i18next';
import CustomButton from "../../components/button/CustomButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import FA5Icons from 'react-native-vector-icons/FontAwesome5';
import MIcons from 'react-native-vector-icons/MaterialIcons';
const FlashcardListScreen = () => {

    const { t, i18n } = useTranslation();
    const [buttonSelected, setButtonSelected] = useState(1);
    const [dailyPracticeReminder, setDailyPracticeReminder] = useState(false);



        //toggle user settings data 
        const toggleSwitch = (id) => {
            if (id == 1) {
                setDefaultCategoryTapHoldSection(previousState => !previousState)
                setUpdated(true)
            }
            else if (id == 2) {
                setPromptForCategory(previousState => !previousState)
                setUpdated(true)
            }
            else if (id == 3) {
                setDailyPracticeReminder(previousState => !previousState)
                setUpdated(true)
            }
        };

        //handel reset scores data of the user
        const handelResetButton = () => {
            console.log('reset settings')
            // Alert.alert(
            //     `${t("ResetSpacedRepetitionScoresTitleText")}`,
            //     `${t("ResetSpacedRepetitionScoresDecsText")}`,
            //     [
            //         {
            //             text: `${t("CancelText")}`,
            //             onPress: () => console.log("Cancel Pressed"),
            //             style: "cancel"
            //         },
            //         { text: `${t("ResetScoresText")}`, onPress: () => console.log("Reset scores Pressed") }
            //     ])
        }

    const renderItem = ({ item, index, move, moveEnd, isActive }) => {
        return (
            <TouchableOpacity
                onPress={() => console.log(buttonSelected)
                }
                onLongPress={move}
                onPressOut={moveEnd}>
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
                            backgroundColor: isActive ? Constants.appColors.PRIMARY_COLOR : Constants.appColors.WHITE,
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}>
                        <View>
                            <Text style={{
                                fontWeight: '700',
                                color: Constants.appColors.BLACK,
                                fontSize: 18,
                                paddingLeft: 16
                            }}>{item.label}</Text>
                            <Text style={{ paddingLeft: 16, paddingVertical: 4 }}>{item.details}</Text>
                        </View>
                    </View>
                    <View style={{ position: 'absolute', right: 16 }}><AntDesign name='right' color={Constants.appColors.PRIMARY_COLOR} size={20} /></View>
                </View>
            </TouchableOpacity>
        )
    }

    const renderList = () => {
        console.log(buttonSelected)
        return (<><FlatList
            data={[{ label: 'aaaaa', details: 'xxxxx' }, { label: 'bbbbb', details: 'zzzzz' }]}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.details}`}
        />
                        <View style={{ marginTop: 12, backgroundColor: Constants.appColors.WHITE, padding: 8, borderRadius: 10 }}>
                    <View style={[styles.itemStyle, { marginBottom: 8 }]}>
                        <Text style={styles.textStyle2}>{`${t("DailyPracticeReminderText")}`}</Text>
                        <Switch
                            trackColor={{ false: Constants.appColors.LIGHTGRAY, true: Constants.appColors.PRIMARY_COLOR }}
                            thumbColor={Constants.appColors.WHITE}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleSwitch(3)}
                            value={dailyPracticeReminder}
                            style={{ position: 'absolute', right: 0, top: 2 }}
                        />
                    </View>
                    <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <Text style={[styles.textStyle2, { zIndex: 4 }]}>{`${t("ReminderTimeText")}`}</Text>
                        <Text style={{ marginRight: 8, fontWeight: 'bold', color: Constants.appColors.BLACK, fontSize: 16 }}>17:00</Text>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 12 }}>
                    <CustomButton
                        style={{ height: 40, width: Sizes.WINDOW_WIDTH - 32, backgroundColor: Constants.appColors.TRANSPARENT, borderWidth: 1, borderColor: Constants.appColors.DARKGRAY, borderRadius: 10 }}
                        title={`${t("ResetToDefaultSettingsText")}`}
                        titleStyle={{ fontSize: 14, color: Constants.appColors.DARKGRAY, fontWeight: 'bold' }}
                        onPress={handelResetButton}
                    />
                </View>
        </>)
    }

    const onStartTestPress = () => {
        console.log("Start Test Press")
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("FlashcardListPageTitle")}`}
                />
                <TouchableOpacity style={{ width: 120, position: 'absolute', marginTop: Platform.OS =='ios' ? 55 :12 }} onPress={onStartTestPress}><Text style={{ marginLeft: 12, color: Constants.appColors.WHITE, fontSize: 18, fontWeight: '400' }}>Start Test</Text></TouchableOpacity>
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
    textStyle2: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.appColors.BLACK,
        width: '67%'
    },
    itemStyle: {
        justifyContent: 'center',
        borderBottomWidth: .5,
        paddingVertical: 8,
        borderBottomColor: Constants.appColors.LIGHTGRAY
    }

});