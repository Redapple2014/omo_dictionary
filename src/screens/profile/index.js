import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text style={{fontSize:30,marginTop:160}}>Profile page</Text>
        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
  }


export default ProfileScreen;
