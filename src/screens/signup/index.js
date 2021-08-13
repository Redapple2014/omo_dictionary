import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import CustomHeader from "../../components/header";

const SinupScreen = () => {
    return (
        <View style={{ flex: 1}}>
                        <CustomHeader
                title='New Account'
            />
            <Text style={{fontSize:30,}}>Signup page</Text>
        </View>
    )
}

SinupScreen.navigationOptions = {
    headerShown: false
  }


export default SinupScreen;
