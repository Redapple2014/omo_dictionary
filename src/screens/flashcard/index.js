import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { getStatusBarHeight } from "react-native-status-bar-height";
import Constants from '../../utills/Constants';
import Sizes from '../../utills/Size';
import CustomHeader from "../../components/header";
import {
    NAVIGATION_CHANGE_PASSWORD_SCREEN_PATH
} from '../../navigations/Routes';
import { useTranslation } from 'react-i18next';
import Icon from "react-native-vector-icons/Ionicons";
import EIcons from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import DraggableFlatList, {
    RenderItemParams,
  } from "react-native-draggable-flatlist";

  const NUM_ITEMS = 10;

//   function getColor(i) {
//     const multiplier = 255 / (NUM_ITEMS - 1);
//     const colorVal = i * multiplier;
//     return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
//   }
  
//   const exampleData: Item[] = [...Array(20)].map((d, index) => {
//     const backgroundColor = getColor(index);
//     return {
//       key: `item-${backgroundColor}`,
//       label: String(index),
//       backgroundColor
//     };
//   });
  
//   const Item = {
//     key: string,
//     label: string,
//     backgroundColor: string,
//   };





const FlashcardScreen = (props) => {

    const { t, i18n } = useTranslation();
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <View style={styles.container}>
                <View style={{ width: 100, left: 2, top: 12, position: 'absolute', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={props.onPressleftIcon}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='chevron-back-sharp' size={23} color={Constants.appColors.WHITE} />
                            <Text style={{ fontSize: 18, color: 'white' }}>{`${t("FlashcardPageTitle")}`}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 6, alignSelf: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', flex: .3 }}>
                    <TouchableOpacity onPress={() => console.log('plus press')}>
                        <EIcons name="plus" size={23} color={Constants.appColors.WHITE} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('plus press')}>
                        <AntDesign name="sound" size={23} color={Constants.appColors.WHITE} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('up press')}>
                        <EIcons name="arrow-bold-up" size={23} color={Constants.appColors.WHITE} />
                    </TouchableOpacity>
                </View>
            </View>
     </View>
            <View>
            {/* <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => setData(data)}
      /> */}
            </View>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
}


export default FlashcardScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: Constants.appColors.PRIMARY_COLOR,
        padding: 6,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        flexDirection: 'row'
    },
    textStyle: {
        color: Constants.appColors.WHITE,
        fontSize: 20,
        marginLeft: 8,
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    addressContainer: { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 6, paddingRight: 8 }
})