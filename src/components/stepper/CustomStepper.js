import React, { Component } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Constants from '../../utills/Constants';
import AntIcons from 'react-native-vector-icons/AntDesign';

const CustomStepper = (props) => {

    return (
        <View style={[props.containerStyle,{ flex: 1, flexDirection: 'row',alignItems:'center',backgroundColor: Constants.appColors.PRIMARY_COLOR,justifyContent:'space-evenly',marginLeft:24 }]}>
            <TouchableOpacity onPress={props.onPlusPress}><View style={{ height:30,alignItems:'center',paddingTop:2 }}><AntIcons name='plus' size={22} color={Constants.appColors.WHITE}/></View></TouchableOpacity>
            <View style={{height:20,width:1,borderLeftWidth:.3,borderLeftColor:Constants.appColors.LIGHTGRAY}}/>
            <TouchableOpacity onPress={props.onMinusPress}><View style={{ height:30,alignItems:'center',paddingTop:2 }}><AntIcons name='minus' size={22} color={Constants.appColors.WHITE}/></View></TouchableOpacity>
        </View>
    );
}


export default CustomStepper;