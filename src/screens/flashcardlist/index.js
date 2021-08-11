import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const FlashcardListScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text style={{fontSize:30,marginTop:160}}>Flashcard List page</Text>
        </View>
    )
}

FlashcardListScreen.navigationOptions = {
    headerShown: false
  }


export default FlashcardListScreen;
