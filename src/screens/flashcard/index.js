import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';

const FlashcardScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red'}}>
            <Text style={{fontSize:30,marginTop:160}}>Flashcard page</Text>
        </View>
    )
}

FlashcardScreen.navigationOptions = {
    headerShown: false
  }


export default FlashcardScreen;
