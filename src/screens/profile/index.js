import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const ProfileScreen = () => {
    return (
        <View style={{ flex: 1,justifyContent:"center",alignItems:'center' }}>
            <Text style={{fontSize:30}}>Profile page</Text>
        </View>
    )
}

ProfileScreen.navigationOptions = {
    headerShown: false
  }


export default ProfileScreen;
