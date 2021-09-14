import React, { useState, useRef, useEffect } from 'react';
import { View, StatusBar, StyleSheet, Button, TextInput, Text,ScrollView } from 'react-native';
import CustomHeader from "../../components/header";
import Constants from '../../utills/Constants';
import { NavigationActions } from 'react-navigation';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useTranslation } from 'react-i18next';
import CustomInput from "../../components/input/CustomInput";
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign'
const NewCardScreen = (props) => {

    const { t, i18n } = useTranslation();
    const koreanHandWordRef = useRef(null);
    const partOfSpeechRef = useRef(null);
    const hanjaRef = useRef(null);
    const englishHandWordRef = useRef(null);
    const [koreanHandWord, setKoreanHandWord] = useState('');
    const [partOfSpeech, setPartOfSpeech] = useState('');
    const [hanja, setHanja] = useState('');
    const [englishHandWord, setEnglishHandWord] = useState('');
    const [deffinition1, setDefinition1] = useState('')
    const [definitionTextInput, setDefinitionTextInput] = useState([]);
    const [definitionInputData, setDefinitionInputData] = useState([]);

    //function to add TextInput dynamically
    const addTextInput = (index) => {
        let textInput = definitionTextInput;
        textInput.push(<TextInput style={styles.textInput}
            onChangeText={(text) => addValues(text, index)} />);
        setDefinitionTextInput(textInput);
    }

    //function to remove TextInput dynamically
    const removeTextInput = () => {
        let textInput = definitionTextInput;
        let inputData = definitionInputData;
        textInput.pop();
        inputData.pop();
        setDefinitionTextInput(textInput)
        setDefinitionInputData(inputData)
    }

    //function to add text from TextInputs into single array
    const addValues = (text, index) => {
        let dataArray = definitionInputData;
        let checkBool = false;
        if (dataArray.length !== 0) {
            dataArray.forEach(element => {
                if (element.index === index) {
                    element.text = text;
                    checkBool = true;
                }
            });
        }
        if (checkBool) {
            setDefinitionInputData(dataArray)
        }
        else {
            dataArray.push({ 'text': text, 'index': index });
            setDefinitionInputData(dataArray)
        }
    }

    //function to console the output
    const getValues = () => {
        console.log('Data : ', definitionInputData);
    }

    const renderData = () => {
        return definitionTextInput.map((value) => value)
    }


    useEffect(()=>{
        renderData()
    })
    
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: Constants.appColors.PRIMARY_COLOR, paddingTop: Platform.OS == "ios" ? getStatusBarHeight() : 0 }}>
                <StatusBar barStyle="light-content" backgroundColor={Constants.appColors.PRIMARY_COLOR} />
                <CustomHeader
                    title={`${t("NewCardText")}`}
                    leftIcon={`${t("CancelText")}`}
                    onPressleftIcon={() => props.navigation.dispatch(NavigationActions.back())}
                    rightIcon={`${t("DoneText")}`}
                    onPressrightIcon={() => console.log('save card details')}
                />
            </View>
            <ScrollView style={{ flex: 1 }}>
                <CustomInput
                    label='Korean Handword'
                    ref={koreanHandWordRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter the korean handword'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 8 }}
                    value={koreanHandWord}
                    onChangeText={
                        value => {
                            setKoreanHandWord(value);
                        }
                    }
                    onSubmitEditing={() => partOfSpeechRef.current.focus()}
                />
                <CustomInput
                    label='Part of speech'
                    ref={partOfSpeechRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Select a part of speech'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 36 }}
                    value={partOfSpeech}
                    onChangeText={
                        value => {
                            setPartOfSpeech(value);
                        }
                    }
                    onSubmitEditing={() => hanjaRef.current.focus()}
                />
                <CustomInput
                    label='English Handword'
                    ref={hanjaRef}
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' Please enter the english handword'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 36 }}
                    value={englishHandWord}
                    onChangeText={
                        value => {
                            setEnglishHandWord(value);
                        }
                    }
                    onSubmitEditing={() => { }}
                />

                <CustomInput
                    label='Definition'
                    labelStyle={{ fontSize: 13, marginBottom: 4, marginLeft: 4, color: Constants.appColors.DARKGRAY, fontWeight: '400' }}
                    placeholder=' please enter sample definition 1'
                    autoCapitalize='none'
                    returnKeyType='next'
                    autoCorrect={false}
                    inputContainerStyle={{ margin: 4, fontSize: 12, backgroundColor: 'white', borderRadius: 6, borderWidth: 0 }}
                    keyboardType='email-address'
                    leftIconContainerStyle={{ marginRight: 16 }}
                    placeholderTextColor={Constants.appColors.LIGHTGRAY}
                    placeholderFontSize={1}
                    containerStyle={{ height: 40, marginTop: 36 }}
                    value={deffinition1}
                    onChangeText={
                        value => {
                            setDefinition1(value);
                        }
                    }
                    onSubmitEditing={() => { }}
                />
                {definitionTextInput.length>0 && renderData()}

                <View style={{ flexDirection: 'row', marginTop:32,alignItems: 'center',marginLeft:16 }}>
                    <Text>Add an additional definition</Text>
                    <View style={{position:'absolute',right:32}}>
                        <TouchableOpacity onPress={()=>addTextInput(definitionTextInput.length)}>
                            <Icon name='pluscircle' size={20} color={Constants.appColors.GREEN} />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View>
        <View style= {styles.row}>
          <View style={{margin: 10}}>
        </View>
        <View style={{margin: 10}}>
        <Button title='Remove' onPress={removeTextInput} />
        </View>
        </View>

        <Button title='Get Values' onPress={getValues} />
      </View>
            </ScrollView>
        </View>
    )
}

NewCardScreen.navigationOptions = {
    headerShown: false,
}


export default NewCardScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    buttonView: {
        flexDirection: 'row'
    },
    textInput: {
        height: 40,
        borderColor: Constants.appColors.LIGHTGRAY,
        borderWidth: 1,
        marginTop:8,
        backgroundColor:Constants.appColors.WHITE,
        paddingHorizontal:16
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
});