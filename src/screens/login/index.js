import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import CustomHeader from "../../components/header";

const LoginScreen = () => {
    return (
        <View style={{ flex: 1 }}>
                        <CustomHeader
                title='Login'
            />
            <Text style={{fontSize:30,}}>Login page</Text>
        </View>
    )
}

LoginScreen.navigationOptions = {
    headerShown: false
  }


export default LoginScreen;
