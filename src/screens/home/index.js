import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text style={{fontSize:30,marginTop:160}}>home page</Text>
        </View>
    )
}

HomeScreen.navigationOptions = {
    headerShown: false
  }


export default HomeScreen;
