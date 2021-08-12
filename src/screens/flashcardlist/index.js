import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const FlashcardListScreen = () => {
    return (
        <View style={{ flex: 1,justifyContent:"center",alignItems:'center' }}>
            <Text style={{fontSize:30,}}>Flashcard List page</Text>
        </View>
    )
}

FlashcardListScreen.navigationOptions = {
    headerShown: false
  }


export default FlashcardListScreen;
