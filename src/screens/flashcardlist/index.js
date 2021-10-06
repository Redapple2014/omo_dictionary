import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import { useTranslation } from 'react-i18next';
import CustomButton from "../../components/button/CustomButton";
const FlashcardListScreen = () => {
    const { t, i18n } = useTranslation();
    const [buttonSelected, setButtonSelected] = useState(1);
    function renderResultContainer() {
        return (
            <>
                {
                    buttonSelected == 1 ?
                        <Text>hggugug</Text>
                        :
                        buttonSelected == 2 ?
                        <Text>ggg</Text>
                        :
                        <Text>hgjgg</Text>
                }
            </>
        )
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("FlashcardListPageTitle")}`}
                />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomWidth: 1, borderColor: Constants.appColors.LIGHTGRAY, marginTop: 10, justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row',justifyContent:'space-evenly',borderWidth:2 }}>
                        <CustomButton
                            style={{ height: 35, borderBottomWidth: buttonSelected == 1 ? 2 : 0, borderColor: Constants.appColors.BLACK, backgroundColor: Constants.appColors.TRANSPARENT, width: 150 }}
                            title='Spaced Repetition'
                            titleStyle={{ fontSize: buttonSelected == 1 ? 16 : 12, color: Constants.appColors.BLACK }}
                            onPress={() => {
                                setButtonSelected(1)
                            }}
                        />
                        <CustomButton
                            style={{ height: 35, borderBottomWidth: buttonSelected == 2 ? 2 : 0, borderColor: Constants.appColors.BLACK, backgroundColor: Constants.appColors.TRANSPARENT, width: 120 }}
                            title='Random'
                            titleStyle={{ fontSize: buttonSelected == 2 ? 16 : 12, color: Constants.appColors.BLACK }}
                            onPress={() => {
                                setButtonSelected(2)
                            }}
                        />
                        <CustomButton
                        style={{ height: 35, borderBottomWidth: buttonSelected == 3 ? 2 : 0, borderColor: Constants.appColors.BLACK, backgroundColor: Constants.appColors.TRANSPARENT, width: 120 }}
                        title='Sequential'
                        titleStyle={{ fontSize: buttonSelected == 3 ? 16 : 12, color: Constants.appColors.BLACK }}
                        onPress={() => {
                            setButtonSelected(3)
                        }}
                    />
                    </View>
                </View>

                <View style={{ flex: 1 }}>{renderResultContainer()}</View>

            </View>
        </View>
    )
}

FlashcardListScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardListScreen;
