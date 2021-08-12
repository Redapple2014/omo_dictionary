import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const FlashcardScreen = () => {
    return (
        <View style={{ flex: 1,justifyContent:"center",alignItems:'center' }}>
            <Text style={{fontSize:30}}>Flashcard page</Text>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
  }


export default FlashcardScreen;
